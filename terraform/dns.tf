
resource "aws_route53_zone" "vet_my_idea_zone" {
  name = "vetmyidea.biz"
}

# Create a Route 53 A record
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.vet_my_idea_zone.zone_id
  name    = "vetmyidea.biz" 
  type    = "A"

  alias {
    name                   = aws_lb.vetmyidea_lb.dns_name
    zone_id                = aws_lb.vetmyidea_lb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "redirect" {
  zone_id = aws_route53_zone.vet_my_idea_zone.zone_id
  name    = "www.vetmyidea.biz"
  type    = "CNAME"
  ttl     = "300"
  records = ["vetmyidea.biz"]
}

resource "aws_route53_record" "reports" {
  zone_id = aws_route53_zone.vet_my_idea_zone.zone_id
  name    = "reports.vetmyidea.biz"
  type    = "A"

 alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}