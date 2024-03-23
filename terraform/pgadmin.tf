
# Define a task definition for PgAdmin
resource "aws_ecs_task_definition" "pgadmin" {
  family                   = "pgadmin"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "pgadmin"
      image     = "dpage/pgadmin4"
      cpu       = 256
      memory    = 512
      essential = true

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "PGADMIN_DEFAULT_EMAIL"
          value = "admin@vetmyidea.biz" 
        },
        {
          name  = "PGADMIN_LISTEN_PORT"
          value = "3000"
        },
          {
          name      = "DATABASE_URL"
          value =   "postgres://dbadmin:$DB_PASSWORD@${aws_db_instance.postgres_db.endpoint}/VetMyIdea"
        }
      ]

      secrets = [
        {
          name  = "PGADMIN_DEFAULT_PASSWORD"
          valueFrom = aws_secretsmanager_secret.pgadminpass.arn
        },
        {
            Name = "DB_PASSWORD",
            ValueFrom = aws_secretsmanager_secret.db_password.arn
        }
      ]
    }
  ])
}

# Create an ECS service for the PgAdmin task
resource "aws_ecs_service" "pgadmin_service" {
  name            = "pgadmin-service"
  cluster         = aws_ecs_cluster.vetmyidea_cluster.id
  task_definition = aws_ecs_task_definition.pgadmin.arn
  desired_count   = 1

  launch_type = "FARGATE"

  network_configuration {
    subnets = [aws_subnet.vetmyidea_subnet_a.id, aws_subnet.vetmyidea_subnet_b.id]  
    security_groups = [aws_security_group.vetmyidea_ecs_sg.id]
    assign_public_ip = true 
  }
}
