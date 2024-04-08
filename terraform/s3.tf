/*
resource "aws_s3_bucket" "vetmyideareports" {
  bucket="vetmyideareports"
}


resource "aws_s3_bucket_cors_configuration" "vetmyideacors" {
  bucket = aws_s3_bucket.vetmyideareports.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET","HEAD"]
    allowed_origins = ["https://vetmyidea.biz"]
    expose_headers  = [ "Access-Control-Allow-Origin", "ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_website_configuration" "vetmyideareports_site" {
  bucket = aws_s3_bucket.vetmyideareports.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_acl" "vetmyideareports_acl" {
    bucket = aws_s3_bucket.vetmyideareports.id
    acl    = "public-read"
    depends_on = [aws_s3_bucket_ownership_controls.vetmyideareports_own]
}

resource "aws_s3_bucket_ownership_controls" "vetmyideareports_own" {
  bucket = aws_s3_bucket.vetmyideareports.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "vetmyideareports_pa" {
  bucket = aws_s3_bucket.vetmyideareports.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
*/
