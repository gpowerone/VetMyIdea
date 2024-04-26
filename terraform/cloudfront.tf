# CloudFront Origin Access Identity to restrict access to the S3 bucket
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for reports.vetmyidea.biz"
}

# CloudFront Distribution with ACM Certificate
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = "vetmyideareports.s3.us-east-2.amazonaws.com"
    origin_id   = "S3-reports.vetmyidea.biz"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  aliases = ["reports.vetmyidea.biz"]

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-reports.vetmyidea.biz"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_All"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Define custom error response
  custom_error_response {
    error_code         = 404
    response_page_path = "/404.html"
    response_code      = 404
    error_caching_min_ttl = 300
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.reports_vet_my_idea_certificate.arn
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }

   web_acl_id = aws_wafv2_web_acl.s3_distribution_waf.arn
}

# Define the WAF Web ACL
resource "aws_wafv2_web_acl" "s3_distribution_waf" {
  provider = aws.us-east-1
  name        = "vmiwebacl"
  scope       = "CLOUDFRONT"
  description = "Example WAF Web ACL for CloudFront. Allows all traffic."
  
  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "exampleWebACLMetric"
    sampled_requests_enabled   = false
  }

  default_action {
    allow {}
  }

  rule {
    name     = "rule-1"
    priority = 1

    override_action {
      count {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "friendly-rule-metric-name"
      sampled_requests_enabled   = false
    }
  }

}