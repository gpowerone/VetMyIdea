terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"  # Specify your AWS region
  alias = "us-east-2"
}

provider "aws" {
  region = "us-east-1"  # Specify your AWS region
  alias = "us-east-1"
}