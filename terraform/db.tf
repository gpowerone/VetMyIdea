resource "aws_db_instance" "postgres_db" {
  allocated_storage    = 20 # Set the storage size in GB
  storage_type         = "gp2"
  name                 = "VetMyIdea"
  engine               = "postgres"
  engine_version       = "14"
  instance_class       = "db.t3.micro" 
  username             = "dbadmin"
  password             = random_password.password.result
  parameter_group_name = "default.postgres14"
  skip_final_snapshot  = false
  deletion_protection  = true 
  vpc_security_group_ids = [aws_security_group.vetmyidea_db_sg.id]
  db_subnet_group_name = aws_db_subnet_group.vetmyidea_db_subnet.name
  publicly_accessible = true
}