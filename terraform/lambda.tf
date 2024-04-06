resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
        Sid = ""
      },
    ]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "lambda_policy"
  description = "IAM policy for executing Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "rds-db:connect",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*" 
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_lambda_function" "update_users" {
  filename         = "nightly.zip"
  function_name    = "VMIUpdateUsers"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "index.handler" 
  runtime          = "nodejs16.x" 

  environment {
    variables = {
      DB_ENDPOINT = aws_db_instance.postgres_db.address
      DB_USER     = "dbadmin"
      DB_PASSWORD = data.aws_secretsmanager_secret_version.db_password_data.secret_string
      DB_NAME     = "VetMyIdea"
    }
  }

}

resource "aws_cloudwatch_event_rule" "daily_trigger" {
  name                = "daily-trigger-at-midnight"
  description         = "Triggers every day at midnight UTC"
  schedule_expression = "cron(0 0 * * ? *)"
}

resource "aws_cloudwatch_event_target" "trigger_lambda_daily" {
  rule      = aws_cloudwatch_event_rule.daily_trigger.name
  target_id = "TriggerLambdaDaily"
  arn       = aws_lambda_function.update_users.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_update_users" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_users.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_trigger.arn
}