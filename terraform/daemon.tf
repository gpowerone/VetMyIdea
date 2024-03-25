
# Cluster definition
resource "aws_ecs_cluster" "vetmyidea_daemon_cluster" {
  name = "vetmyidea-daemon-cluster"
}

# Task definition
resource "aws_ecs_task_definition" "vetmyidea_daemon_task" {
  family                   = "vetmyidea-daemon-task"
  network_mode             = "awsvpc"
  cpu                      = "1024" 
  memory                   = "2048" 
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn 

  container_definitions = jsonencode([
    {
      name      = "vetmyidea-daemon"
      image     = "693727416545.dkr.ecr.us-east-2.amazonaws.com/vetmyidea:latest" 
      cpu       = 1024
      memory    = 2048
      essential = true
      command   = ["node", "./jobs/forever.js"],
      environment = [
        {
            name = "NUXT_DB_HOST"
            value = aws_db_instance.postgres_db.address
        }
      ],
      secrets = [
          {
            Name = "NUXT_DB_PASSWORD",
            ValueFrom = aws_secretsmanager_secret.db_password.arn
          },
          {
            Name="NUXT_AWS_CLIENT"
            ValueFrom= aws_secretsmanager_secret.aws_client.arn
          },{
            Name="NUXT_AWS_SECRET",
            ValueFrom= aws_secretsmanager_secret.aws_secret.arn
          },{
            Name="OPENAI",
            ValueFrom= aws_secretsmanager_secret.openai.arn
          }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.vetmyidea_logs_process.name
          awslogs-region        = "us-east-2"
          awslogs-stream-prefix = "vmi-process"
        }
      }
    }
  ])

  
}

# ECS service to run the task definition in daemon mode
resource "aws_ecs_service" "vetmyidea_daemon" {
  name            = "vetmyidea-daemon-service"
  cluster         = "vetmyidea-daemon-cluster"
  task_definition = aws_ecs_task_definition.vetmyidea_daemon_task.arn
  deployment_minimum_healthy_percent = 100


  # Use the DAEMON scheduling strategy for a daemon service
  scheduling_strategy = "DAEMON"

  network_configuration {
    subnets = [aws_subnet.vetmyidea_subnet_a.id, aws_subnet.vetmyidea_subnet_b.id]  
    security_groups = [aws_security_group.vetmyidea_ecs_sg.id]
    assign_public_ip = false 
  }

}
