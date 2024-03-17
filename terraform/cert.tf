
resource "aws_acm_certificate" "vet_my_idea_certificate" {
  domain_name       = "vetmyidea.biz"
  validation_method = "DNS"
}

resource "aws_route53_record" "vet_my_idea_validation" {
  for_each = {
    for dvo in aws_acm_certificate.vet_my_idea_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = aws_route53_zone.vet_my_idea_zone.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "vet_my_idea_validation" {
  certificate_arn         = aws_acm_certificate.vet_my_idea_certificate.arn
  validation_record_fqdns = [for record in aws_route53_record.vet_my_idea_validation : record.fqdn]
}



data "aws_acm_certificate" "reports_vet_my_idea_certificate" {
  domain   = "reports.vetmyidea.biz"
  statuses = ["ISSUED"]
  provider=aws.us-east-1
}
