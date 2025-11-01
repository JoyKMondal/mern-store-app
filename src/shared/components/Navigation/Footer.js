import React from "react";
import styled from "styled-components";
import "./Footer.css";

const FooterContainer = styled.footer`
  background: #f1f2f6;
  padding: 2rem 1rem;
  text-align: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 10rem;
`;

const NewsletterInput = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
`;

const NewsletterButton = styled.button`
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;

  a {
    margin: 0 1rem;
    color: #6c757d;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Copyright = styled.div`
  margin-top: 1rem;
  color: #6c757d;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  a {
    margin: 0 0.5rem;
    color: #6c757d;
    text-decoration: none;
    font-size: 1.5rem;

    &:hover {
      color: #007bff;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <div className="top-footer">
        <div>
          <NewsletterInput type="email" placeholder="Enter your email" />
          <NewsletterButton>Subscribe</NewsletterButton>
        </div>
        <LinksContainer>
          <a href="#features">Features</a>
          <a href="#blog">Blog</a>
          <a href="#pricing">Pricing</a>
          <a href="#services">Services</a>
        </LinksContainer>
        <SocialIcons>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://www.facebook.com/joymondal.joymondal.52090"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://github.com/hellow-world007"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-brands fa-github"></i>
          </a>
        </SocialIcons>
      </div>
      <div className="top-footer">
        <LinksContainer>
          <a href="#terms">Terms</a>
          <a href="#about">About</a>
          <a href="#privacy">Privacy</a>
          <a href="#contact">Contact</a>
        </LinksContainer>
        <Copyright className="footer-title">MERN Store</Copyright>
        <Copyright>
          © 2019 All Rights Reserved.{" "}
        </Copyright>
      </div>
    </FooterContainer>
  );
};

export default Footer;
