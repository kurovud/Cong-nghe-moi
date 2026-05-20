import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand__logo">
              <span className="footer-brand__logo-icon">PB</span>
              PC Builder Shop
            </div>
            <p className="footer-brand__text">
              Chuyên cung cấp linh kiện PC, laptop gaming và bộ PC build sẵn.
              Chatbot AI tư vấn cấu hình 24/7.
            </p>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="footer-col__title">Liên hệ</h4>
            <ul className="footer-col__links">
              <li>Hotline: 1900-xxxx</li>
              <li>Email: info@pcbuildershop.vn</li>
              <li>123 Nguyễn Văn Cừ, Q.5, TP.HCM</li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="footer-col__title">Chính sách</h4>
            <ul className="footer-col__links">
              <li>Bảo hành chính hãng</li>
              <li>Đổi trả trong 7 ngày</li>
              <li>Miễn phí lắp ráp khi mua combo</li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="footer-col__title">Hỗ trợ</h4>
            <ul className="footer-col__links">
              <li>
                <Link href="/chat">Tư vấn AI 24/7</Link>
              </li>
              <li>Dịch vụ lắp ráp tại nhà</li>
              <li>Giao hàng toàn quốc</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          © 2025 PC Builder Shop. All rights reserved. Powered by AI Chatbot.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
