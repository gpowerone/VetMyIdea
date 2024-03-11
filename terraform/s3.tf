resource "aws_s3_bucket" "redirect_bucket" {
  bucket = "vetmyidea-redirect-bucket"
}

resource "aws_s3_bucket_website_configuration" "redirect_bucket_site" {
  bucket = aws_s3_bucket.redirect_bucket.id

  redirect_all_requests_to {
     host_name ="vetmyidea.biz"
     protocol = "https"
  }
}

resource "aws_s3_bucket_acl" "redirect_bucket_acl" {
    bucket = aws_s3_bucket.redirect_bucket.id
    acl    = "public-read"
    depends_on = [aws_s3_bucket_ownership_controls.redirect_bucket_own]
}


resource "aws_s3_bucket_ownership_controls" "redirect_bucket_own" {
  bucket = aws_s3_bucket.redirect_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "redirect_bucket_pa" {
  bucket = aws_s3_bucket.redirect_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket" "vetmyideacore" {
  bucket="vetmyideacore"
}
