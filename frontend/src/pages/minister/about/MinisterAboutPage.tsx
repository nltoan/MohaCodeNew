import { Col, Container, Image, Row, Table } from 'react-bootstrap';
import './MinisterAboutPage.scss';
import { CardSection, PageHeader } from '@/components';
export const MinisterAboutPage = () => {
  const ITEMS = [
    {
      time: '9/1983 - 4/1992',
      details: [
        'Công tác tại Trường Đảng huyện Vĩnh Thuận, cán bộ Ban Tuyên giáo Huyện ủy, cán bộ Ban Tuyên huấn - Tổ chức Huyện ủy Vinh Thuận, tinh Kiên Giang.',
      ],
    },
    { time: '5/1992 - 9/1994', details: ['Phó Bí thư Huyện đoàn Vính Thuận, tỉnh Kiên Giang.'] },
    {
      time: '10/1994 - 12/2001',
      details: [
        'Huyện ủy viên.',
        'Bí thư huyện Đoàn.',
        'Ủy viên Ban Thường vụ Huyện ủy.',
        'Trường Ban Tố chức Huyện ủy Vĩnh Thuận, tỉnh Kiên Giang.',
      ],
    },
    {
      time: '1/2002 - 10/2005',
      details: ['Ủy viên Ban Thường vụ Huyện ủy', 'Phó Chủ tịch UBND huyện Vĩnh Thuận, tỉnh Kiên Giang.'],
    },
    {
      time: '11/2005 - 9/2010',
      details: ['Phó Bí thư Huyện ủy.', 'Chủ tịch Ủy ban nhân dân huyện Vĩnh Thuận, tỉnh Kiên Giang.'],
    },
    { time: '10/2010 - 10/2012', details: ['Tỉnh ủy viên, Bí thư Huyện ủy Vĩnh Thuận, tỉnh Kiên Giang.'] },
    {
      time: '11/2012 - 9/2015',
      details: ['Tỉnh ủy viên.', 'Phó Trưởng ban Thường trực Ban Tổ chức Tỉnh ủy Kiên Giang.'],
    },
    { time: '10/2015 - 6/2018', details: ['Ủy viên Ban Thường vụ Tỉnh ủy.', 'Trưởng Ban Tổ chức Tỉnh ủy Kiên Giang.'] },
    {
      time: '7/2018 - 6/2020',
      details: ['Ủy viên Ban Thường vụ Tinh ủy.', 'Phó Chủ tịch Ủy ban nhân dân tỉnh Kiên Giang.'],
    },
    { time: '7/2020 - 9/2020', details: ['Phó Bí thư Tỉnh ủy, Chủ tịch Ủy ban nhân dân tỉnh Kiên Giang.'] },
    {
      time: '10/2020 - 11/2020',
      details: ['Bí thư Tỉnh ủy, Chủ tịch Ủy ban nhân dân tỉnh.', 'Bí thư Đảng ủy Quân sự tỉnh Kiên Giang.'],
    },
    { time: '11/2020 - 1/2021', details: ['Bí thư Tình ủy, Bí thư Đảng ủy Quân sự tỉnh Kiên Giang.'] },
    {
      time: '2/2021 - 1/2025',
      details: [
        'Ủy viên Trung ương Đảng khóa XIII, Bí thư Tỉnh ủy Kiên Giang.',
        'Đảng ủy viên Quân khu 9, Bí thư Đảng ủy Quân sự tỉnh Kiên Giang.',
        'Trưởng Đoàn Đại biểu Quốc hội tỉnh Kiên Giang.',
      ],
    },
    {
      time: '1/2025',
      details: [
        'Ủy viên Trung ương Đảng khóa XIII, Bí thư Thành ủy Cần Thơ.',
        'Đảng ủy viên Quân khu 9, Bí thư Đảng ủy Quân sự thành phố Cần Thơ.',
      ],
    },
    {
      time: '1/7/2025 - 28/9/2025',
      details: ['Ủy viên Trung ương Đảng khóa XIII', 'Bí thư Thành ủy Căn Thơ (mới) nhiệm kỳ 2020-2025.'],
    },
    { time: '9/2025', details: ['Phó Trưởng Ban Tổ chức Trung ương', 'Thứ trưởng Thường trực Bộ Nội vụ.'] },
    { time: '25/10/2025', details: ['Quốc hội phê chuẩn bổ nhiệm giữ chức Bộ trưởng Bộ Nội vụ nhiệm kỳ 2021-2026.'] },
  ];
  return (
    <div className="mh-minister-about">
      <Container>
        <div className="mh-minister-about-title">
          <div>Tiểu sử Bộ trưởng</div>
          <PageHeader date={'23/02/2025 14:10'} onPrint={() => {}} viewCount={43599} />
        </div>
      </Container>

      <div className="mh-minister-about-summary">
        <Container>
          <div className="mh-minister-about-summary-inner">
            <Row>
              <Col lg={6}>
                <div className="mh-minister-about-summary-image">
                  <Image src="/images/leaders/leader-1.png" alt="" />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mh-minister-about-summary-info">
                  <div>TÓM TẮT TIỂU SỬ ĐỒNG CHÍ</div>
                  <div className="mh-minister-about-summary-name">ĐỖ THANH BÌNH</div>
                  <div>⭐️ ỦY VIÊN TRUNG ƯƠNG ĐẢNG KHÓA XIII</div>
                  <div>⭐️ ĐẠI BIỂU QUỐC HỘI KHÓA XV</div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <div className="mh-minister-about-info">
        <Container>
          <Row className="justify-content-center">
            <Col xl={7} lg={8}>
              <Table>
                <tbody>
                  <tr>
                    <td>NGÀY SINH</td>
                    <td>15/3/1967</td>
                  </tr>
                  <tr>
                    <td>Dân tộc</td>
                    <td>Kinh</td>
                  </tr>
                  <tr>
                    <td>Tôn giáo</td>
                    <td>Không</td>
                  </tr>
                  <tr>
                    <td>Quê quán</td>
                    <td>Tỉnh Cà Mau</td>
                  </tr>
                  <tr>
                    <td>Chức vụ Đảng</td>
                    <td>Ủy viên Trung ương Đảng khóa XIII</td>
                  </tr>
                  <tr>
                    <td>Chức vụ</td>
                    <td>Bộ trưởng</td>
                  </tr>
                  <tr>
                    <td>Ngày vào Đảng</td>
                    <td>19/9/1990</td>
                  </tr>
                  <tr>
                    <td>Ngày chính thức</td>
                    <td>19/9/1991</td>
                  </tr>
                  <tr>
                    <td>Trình độ chuyên môn</td>
                    <td>Thạc sĩ Kinh tế, Cử nhân Kinh tế chính trị</td>
                  </tr>
                  <tr>
                    <td>Trình độ lý luận chính trị</td>
                    <td>Cử nhân</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <div className="mh-minister-about-info-card">
            Tại kỳ họp thứ 10, Quốc hội khóa XV đã biểu quyết thông qua Nghị quyết phê chuẩn đề nghị của Thủ tướng Chính
            phủ về việc bổ nhiệm <strong>đồng chí Đỗ Thanh Bình</strong>, Ủy viên Trung ương Đảng khóa XIII, Phó Trưởng
            Ban Tổ chức Trung ương, Thứ trưởng Thường trực Bộ Nội vụ giữ chức <strong>Bộ trưởng Bộ Nội vụ</strong>.
          </div>
        </Container>
      </div>

      <div className="mh-minister-about-history">
        <Container>
          <CardSection title="Quá trình công tác">
            <div className="mh-minister-about-items">
              {ITEMS.map((item) => (
                <div key={item.time} className="mh-minister-about-item">
                  <div className="mh-minister-about-item-time">{item.time}</div>
                  <ul>
                    {item.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardSection>
        </Container>
      </div>
    </div>
  );
};
