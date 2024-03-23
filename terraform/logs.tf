resource "aws_cloudwatch_log_group" "vetmyidea_logs" {
     name="vetmyidea-logs"
     retention_in_days = 7 
}

resource "aws_cloudwatch_log_group" "vetmyidea_logs_process" {
     name="vetmyidea-process"
     retention_in_days = 7 
}