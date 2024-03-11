resource "aws_vpc" "vetmyidea_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "vetmyidea_vpc"
  }
}

resource "aws_internet_gateway" "gw" { 
  vpc_id = aws_vpc.vetmyidea_vpc.id
}

resource "aws_route_table" "vetmyidea_route_table" {
  vpc_id = aws_vpc.vetmyidea_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "vetmyidea-route-table"
  }
}


resource "aws_subnet" "vetmyidea_subnet_a" {
  vpc_id                  = aws_vpc.vetmyidea_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone = "us-east-2a"

  tags = {
    Name = "vetmyidea_subnet_a"
  }
}

resource "aws_subnet" "vetmyidea_subnet_b" {
  vpc_id                  = aws_vpc.vetmyidea_vpc.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone = "us-east-2b"

  tags = {
    Name = "vetmyidea_subnet_b"
  }
}

resource "aws_db_subnet_group" "vetmyidea_db_subnet" {
  name       = "vetmyideadbsubnet"
  subnet_ids = [aws_subnet.vetmyidea_subnet_a.id,aws_subnet.vetmyidea_subnet_b.id]

  tags = {
    Name = "Vet My Idea DB Subnet"
  }
}

resource "aws_route_table_association" "vetmyidea_a_association" {
  subnet_id      = aws_subnet.vetmyidea_subnet_a.id
  route_table_id = aws_route_table.vetmyidea_route_table.id
}

resource "aws_route_table_association" "vetmyidea_b_association" {
  subnet_id      = aws_subnet.vetmyidea_subnet_b.id
  route_table_id = aws_route_table.vetmyidea_route_table.id
}