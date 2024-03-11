resource "aws_ecs_cluster" "vetmyidea_cluster" {
  name = "vetmyidea-cluster"
}

resource "aws_ecs_task_definition" "vetmyidea" {
  family                   = "vetmyidea"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([{
    name  = "vetmyidea",
    image = "693727416545.dkr.ecr.us-east-2.amazonaws.com/vetmyidea:latest", 
    portMappings = [{
      containerPort = 3000,
      hostPort      = 3000
    }],
    command=["/bin/bash", "-c", "npx sequelize-cli db:migrate --env production && node ./.output/server/index.mjs"],
    logConfiguration={
       LogDriver: "awslogs",
       Options: {
         "awslogs-group": aws_cloudwatch_log_group.vetmyidea_logs.name,
         "awslogs-region": "us-east-2", "awslogs-stream-prefix": "vetmyidea"
       }
    },
    environment = [
    {
      name  = "NUXT_PUBLIC_ENV_URL",
      value = "https://www.vetmyidea.biz"
    },
    {
      name = "NUXT_DB_HOST"
      value = aws_db_instance.postgres_db.address
    },
    ],
    secrets = [{
      Name = "NUXT_DB_PASSWORD",
      ValueFrom = aws_secretsmanager_secret.db_password.arn
    },
    {
       Name="NUXT_AWS_CLIENT"
       ValueFrom= aws_secretsmanager_secret.aws_client.arn
    },{
       Name="NUXT_AWS_SECRET",
       ValueFrom= aws_secretsmanager_secret.aws_secret.arn
    },
    {
       Name="NUXT_PUBLIC_RECAPTCHA_SITEKEY",
       ValueFrom= aws_secretsmanager_secret.recaptcha_sitekey.arn
    },
    {
       Name="NUXT_RECAPTCHA_SECRET",
       ValueFrom= aws_secretsmanager_secret.recaptcha_secret.arn
    }]
  }])
}

resource "aws_ecs_service" "vetmyidea_service" {
  name            = "vetmyidea-service"
  cluster         = "vetmyidea-cluster" 
  task_definition = aws_ecs_task_definition.vetmyidea.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets = [aws_subnet.vetmyidea_subnet_a.id, aws_subnet.vetmyidea_subnet_b.id]  
    security_groups = [aws_security_group.vetmyidea_ecs_sg.id]
    assign_public_ip = true 
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.vetmyidea_tg.arn
    container_name   = "vetmyidea"
    container_port   = 3000
  }

  desired_count = 1
}