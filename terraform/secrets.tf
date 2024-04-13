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

data "aws_secretsmanager_secret_version" "db_password_data" {
  secret_id = aws_secretsmanager_secret.db_password.id
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

resource "aws_secretsmanager_secret" "google_client" {
  name = "google_client_vmi"
}

resource "aws_secretsmanager_secret" "google_secret" {
  name = "google_secret_vmi"
}

resource "aws_secretsmanager_secret" "oauth_token" {
  name = "oauth_token_vmi"
}

resource "aws_secretsmanager_secret" "oauth_secret" {
  name = "oauth_secret_vmi"
}

resource "aws_secretsmanager_secret" "oauth_userinfo" {
  name = "oauth_userinfo_vmi"
}

resource "aws_secretsmanager_secret" "oauth_scopes" {
  name = "oauth_scopes_vmi"
}

resource "aws_secretsmanager_secret" "oauth_uri" {
  name = "oath_uri_vmi"
}

resource "aws_secretsmanager_secret" "oauth_redirect" {
  name = "oauth_redirect_vmi"
}

resource "aws_secretsmanager_secret" "oauth_client" {
  name = "oauth_client_vmi"
}

resource "aws_secretsmanager_secret" "openai" {
  name = "openai_vmi"
}

resource "aws_secretsmanager_secret" "pgadminpass" {
  name = "pgadminpass_vmi"
}

resource "aws_secretsmanager_secret" "linkedin_client" {
  name = "linkedin_client_vmi"
}

resource "aws_secretsmanager_secret" "linkedin_secret" {
  name = "linkedin_secret_vmi"
}

