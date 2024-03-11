resource "random_password" "password" {
  length  = 16
  special = true
  override_special = "#$*"
}

resource "aws_secretsmanager_secret" "db_password" {
  name = "db_password_vmi"
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.password.result
}

resource "aws_secretsmanager_secret" "aws_client" {
  name = "aws_client_vmi"
}

resource "aws_secretsmanager_secret" "aws_secret" {
  name = "aws_secret_vmi"
}

resource "aws_secretsmanager_secret" "recaptcha_sitekey" {
  name = "recaptcha_sitekey_vmi"
}

resource "aws_secretsmanager_secret" "recaptcha_secret" {
  name = "recaptcha_secret_vmi"
}