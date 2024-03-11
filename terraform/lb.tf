resource "aws_lb" "vetmyidea_lb" {
  name               = "vetmyidea-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.vetmyidea_lb_sg.id]
  subnets            = [aws_subnet.vetmyidea_subnet_a.id,aws_subnet.vetmyidea_subnet_b.id]
}

resource "aws_lb_listener" "vetmyidea_https" {
  load_balancer_arn = aws_lb.vetmyidea_lb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.vet_my_idea_certificate.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.vetmyidea_tg.arn
  }
}

resource "aws_lb_listener" "vetmyidea_http" {
  load_balancer_arn = aws_lb.vetmyidea_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_target_group" "vetmyidea_tg" {
  name     = "vetmyidea-tg"
  port     = 3000
  protocol = "HTTP"
  target_type = "ip"
  vpc_id   = aws_vpc.vetmyidea_vpc.id
  slow_start = 0
  load_balancing_algorithm_type = "round_robin"
  stickiness {
    enabled=false
    type = "lb_cookie"
  }
}