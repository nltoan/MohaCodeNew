# Thuyết minh chi tiết các chức năng quản trị

## Phạm vi, quy ước và căn cứ

Tài liệu này triển khai chi tiết các hạng mục 16–24 và 29 trong ma trận 29 hạng mục: quản trị tin tức; văn bản; Chuyên trang Bộ trưởng; trang Đảng bộ Bộ Nội vụ; đa phương tiện; lấy ý kiến nhân dân; văn bản QPPL/CĐĐH; Hội nghị - Sự kiện; quản trị hệ thống/người dùng; và thông tin kết nối/tích hợp hiển thị trên Cổng. Mã yêu cầu gốc cần được đối chiếu với HSYC chính thức trước khi phát hành hồ sơ chào thầu. Trích dẫn B0738, B0742, B0746 dưới đây là mã dòng theo bản trích xuất đang dùng tại `docs/ho-so-dap-ung/02-dap-ung-chuc-nang.md` và ma trận `docs/ho-so-dap-ung/09-ma-tran-29-hang-muc.md`.

Đây là đề xuất giải pháp, thiết kế nghiệp vụ và tiêu chí có thể kiểm chứng, không phải cam kết rằng các phần mềm hiện đã đáp ứng hoặc biên bản thử nghiệm. Tên trường/API trong các bảng “mô hình logic đề xuất” là từ vựng nghiệp vụ để thống nhất yêu cầu; không khẳng định endpoint hay schema tương ứng đang tồn tại. Ngoại trừ các trường được nêu rõ trong mô tả HSYC trích xuất, trường bổ sung trong bảng logic là gợi ý tùy chọn hoặc có điều kiện, không tự trở thành tiêu chí bắt buộc. Không đưa trường, tính năng hay ràng buộc mở rộng vào phạm vi nghiệm thu nếu chưa được Chủ đầu tư xác nhận. Khi triển khai, hợp đồng API, cấu trúc dữ liệu, thời hạn lưu, số liệu hiệu năng và ma trận vai trò cần được chốt cùng Chủ đầu tư. Dẫn chiếu mã nguồn nêu hiện trạng rà soát tĩnh có giới hạn; không chứng minh tính đầy đủ, vận hành, an toàn hoặc nghiệm thu.

Các trạng thái như nháp, chờ duyệt, trả lại, đã duyệt, đã xuất bản là mô hình luồng đề xuất chung. Nơi mã hiện hữu có nhãn/trạng thái khác, cần ánh xạ trong thiết kế chi tiết; không âm thầm đồng nhất tên trạng thái. Với phần chưa có bằng chứng mã nguồn, tài liệu gọi rõ là phương án hoàn thiện. Bằng chứng mã nguồn ghi dạng đường dẫn tương đối để người rà soát mở tại repository; các dòng là điểm tham chiếu xấp xỉ theo tài liệu rà soát, cần xác nhận ở phiên bản mã nguồn được bàn giao.

## 16. Quản lý tin tức, chuyên mục và loại tin

**Căn cứ:** B0738.R020; B0742.R024–R027; B0746.R012–R013. Đối tượng gồm bài tin và quan hệ của bài với chuyên mục, loại tin, vùng hiển thị, tệp, tin liên quan, quy trình duyệt và người dùng. Đây là nghiệp vụ biên tập có đầu ra công khai nên sửa nội dung và phát hành là các hành động riêng, có thể được giao cho các vai trò khác nhau.

**Bằng chứng tĩnh.** `backend/src/pages/TinTuc.js` có bảng dữ liệu, lọc/tìm kiếm, hộp soạn thảo, tab thông tin chung, vùng hiển thị, tin liên quan và tệp; gọi lớp lưu trữ dữ liệu cấu hình theo `TinTucs/Get`, `Post`, `Put`, `Delete`. Giao diện phân biệt các danh sách `owner`, `draft`, `wait`, `approving`, `publish`, `unpublish`, `cancel`, `infographic`, `emagazine`. Các nút thao tác đọc cờ `CanEdit`, `CanSendApprove`, `CanApprove`, `CanSendNext`, `CanPublish`, `CanUnPublish`; đó là dấu vết workflow gắn với dữ liệu, chưa xác nhận điều kiện được thực thi đầy đủ ở mọi điểm vào. `api/Controllers/API/TinTucsController.cs` có truy vấn lọc theo loại danh sách và thao tác CRUD; query sử dụng quan hệ bước quy trình/người được giao. `backend/src/pages/ChuyenMuc.js` dùng TreeList có cha/con, thứ tự, quy trình kiểm duyệt, trạng thái hoạt động, hiển thị và layout. `backend/src/pages/DM_LoaiTin.js` cho phép sửa tên, thứ tự, hiển thị loại tin. Các điểm trên chưa chứng minh riêng khả năng tạo slug/SEO, kiểm tra tệp, mọi quyền API hay điều kiện xuất bản trên cổng.

### Vai trò, phạm vi và màn hình

Người soạn tạo và sửa nội dung thuộc phạm vi được giao; biên tập viên quản lý chuyên mục/loại tin theo đơn vị hoặc chuyên trang; người duyệt xem bản gửi, so sánh nội dung và duyệt/trả lại; người xuất bản phát hành hoặc gỡ theo ủy quyền; quản trị nội dung cấu hình danh mục, vùng hiển thị và quy trình. Khách truy cập chỉ nhận bài công khai còn hiệu lực. Mô hình phân tách này là đề xuất phân quyền tối thiểu, cần Chủ đầu tư xác định nhóm người dùng thực tế và quy tắc kiêm nhiệm.

Màn hình danh sách đề xuất có tìm kiếm theo tiêu đề/từ khóa, chuyên mục, loại tin, người tạo, khoảng ngày, ngôn ngữ và trạng thái; phân trang và sắp xếp; cột mã, tiêu đề, chuyên mục chính, người phụ trách, lần cập nhật, trạng thái, bước duyệt và hành động khả dụng. Bộ lọc không được làm lộ bài ngoài phạm vi người dùng. Hộp soạn thảo chia phần: thông tin chung (tiêu đề, mô tả, nội dung, tác giả/nguồn, chuyên mục chính, chuyên mục hiển thị thêm, loại tin, ngôn ngữ); trình bày (ảnh đại diện, tệp đính kèm, vùng hiển thị, tin liên quan); phát hành/SEO (slug, tiêu đề/mô tả tìm kiếm, ngày dự kiến, canonical nếu thuộc phạm vi); kiểm duyệt (quy trình, ghi chú, lịch sử). Tab và trường cụ thể cần được thống nhất với HSYC; không mặc định trường đề xuất đã có trong mã hiện tại.

`[FIG:editorial-workflow]`

### Luồng xử lý chính

1. Người soạn chọn “Tạo tin”, chọn chuyên mục đang hoạt động và loại tin phù hợp. Hệ thống tải các lựa chọn tham chiếu đã được phép; mặc định ngày lập từ thời điểm máy chủ, không tự suy ra ngày xuất bản chính thức.
2. Người soạn nhập tiêu đề, nội dung, mô tả, nguồn/tác giả, ngôn ngữ và ảnh. Công cụ biên tập lưu bản nháp; bản nháp có thể lưu nhiều lần mà không xuất hiện công khai. Khi cần tệp, người dùng tải lên qua kho tệp được kiểm soát rồi liên kết tệp hợp lệ với bài.
3. Người soạn gán một chuyên mục chính, có thể gán các chuyên mục bổ sung nếu được quy định; đặt loại tin, vùng hiển thị, mức nổi bật và tin liên quan. Hệ thống hiển thị bản xem trước theo giao diện công khai tương ứng, nhưng xem trước không làm thay đổi trạng thái phát hành.
4. Khi gửi duyệt, máy chủ kiểm tra trường bắt buộc, chuyên mục còn hiệu lực, liên kết tệp, slug và quy trình. Bản ghi chuyển sang trạng thái chờ ở bước đầu; hệ thống lưu thời điểm gửi và người gửi. Nếu quy trình có nhiều bước, chỉ người/nhóm được giao ở bước hiện hành nhận quyền xử lý.
5. Người duyệt mở bản ghi trong phạm vi được giao, đọc nội dung và tệp, xem lịch sử, rồi chọn duyệt hoặc trả lại kèm lý do. Trả lại đưa bài về người soạn và ghi chú trở thành bắt buộc; thay đổi nội dung sau duyệt làm mất hiệu lực phê duyệt của phiên bản cũ hoặc khởi tạo lại bước duyệt theo quy tắc được chốt.
6. Người có quyền phát hành duyệt lần cuối, đặt thời điểm xuất bản nếu có chức năng hẹn giờ, rồi xác nhận. Chỉ bản ghi được duyệt, đến thời điểm hiệu lực và không bị gỡ mới xuất hiện trên danh sách/chi tiết công khai. Gỡ bài ghi người, lý do, thời điểm; dữ liệu quan hệ/tệp không bị xóa vật lý theo thao tác gỡ.
7. Sửa bài đã phát hành tạo phiên bản cập nhật và giữ khả năng truy nguyên phiên bản trước. Tùy chính sách, sửa trường hiển thị có thể yêu cầu duyệt lại. Xóa cứng chỉ dành cho quản trị được phân quyền và chỉ khi không còn tham chiếu; thao tác thông thường ưu tiên lưu trữ/ngừng hiển thị.

### Dữ liệu logic đề xuất

| Đối tượng | Trường nghiệp vụ chính | Ghi chú |
|---|---|---|
| Tin | mã; tiêu đề; mô tả; nội dung; tác giả/nguồn; ngôn ngữ; loại tin; chuyên mục chính; danh sách chuyên mục phụ; ảnh đại diện; slug; SEO; thời điểm dự kiến/thực tế; trạng thái; người tạo/cập nhật | Slug duy nhất trong phạm vi site/ngôn ngữ theo quy tắc Chủ đầu tư duyệt; lịch sử phiên bản tách khỏi bản ghi hiện hành |
| Quan hệ tin | tin; tin liên quan; thứ tự; vùng hiển thị; thời điểm tạo | Kiểm tra đối tượng đích còn tồn tại và có thể công khai |
| Tệp bài tin | tin; mã tệp; vai trò tệp; thứ tự; chú thích | Metadata tệp nằm trong kho tệp; bản ghi quan hệ không thay thế kiểm tra quyền truy cập |
| Nhật ký biên tập | đối tượng; phiên bản; hành động; trạng thái trước/sau; tác nhân; thời điểm; lý do | Nhật ký bất biến ở cấp nghiệp vụ; thời hạn lưu do Chủ đầu tư chốt |

### Quy tắc, trạng thái và quyền

Quy tắc trường bắt buộc khi gửi duyệt cần được chốt theo từng loại tin; tiêu đề và các dữ liệu cần để nhận diện bài là đề xuất tối thiểu, còn ngôn ngữ, mô tả, ảnh, SEO, ngày phát hành hay trường khác chỉ bắt buộc khi HSYC/quy tắc đã duyệt nêu rõ. Slug tự sinh/quy tắc duy nhất là yêu cầu có trong B0742.R025; cách chuẩn hóa, xử lý trùng và giữ đường dẫn cũ là chi tiết triển khai cần xác nhận. Ngày xuất bản không sớm hơn thời điểm cho phép; nếu lên lịch, nội dung không hiển thị trước hạn. Quan hệ bài tự tham chiếu hoặc vòng lặp tin liên quan phải bị chặn nếu có quan hệ loại này. Tệp phải tồn tại, thuộc loại/kích thước cho phép và người thao tác có quyền liên kết theo chính sách được chốt. Nội dung HTML cần được làm sạch đầu vào/đầu ra theo chính sách đã chốt.

Trạng thái khái niệm: Nháp → Chờ duyệt → Đang duyệt bước n → Đã duyệt → Đã xuất bản; nhánh Trả lại → Nháp/Chờ gửi lại; Đã xuất bản → Đã gỡ; bản đã gỡ có thể tái xuất bản sau phê duyệt phù hợp. Đây là trạng thái đề xuất; các giá trị `draft`, `waitapprove`, `rejectapprove`, `public`, `cancelpublic` xuất hiện trong truy vấn mã hiện hữu, nhưng cần đối chiếu toàn bộ quy trình thực tế. Người soạn không tự đặt mình thành người duyệt nếu không có quyền; nút ẩn ở giao diện không thay thế kiểm tra quyền ở máy chủ. Quyền phải kiểm soát theo hành động và phạm vi bản ghi: xem, tạo, sửa, gửi, duyệt từng bước, phát hành, gỡ, quản lý danh mục và xóa/lưu trữ.

### Ngoại lệ và cách xử lý

- Slug trùng: trả thông báo cụ thể, giữ bản nháp để người soạn điều chỉnh; không ghi đè bản tin khác.
- Chuyên mục bị khóa sau khi mở biểu mẫu: khi lưu/gửi lại phải xác thực trạng thái mới; yêu cầu chọn chuyên mục thay thế hoặc cho quản trị xử lý bản ghi cũ.
- Tệp tải lên lỗi/mất quyền: không tạo liên kết mồ côi; chỉ rõ tệp không được gắn và cho phép thử lại.
- Người duyệt không còn được phân công hoặc quy trình thay đổi: từ chối thao tác theo phiên bản quy trình hiện hành, thông báo cho quản trị, giữ nguyên trạng thái để phân công lại.
- Hai người sửa đồng thời: phát hiện phiên bản đã thay đổi, yêu cầu tải lại/so sánh; không âm thầm ghi đè.
- Lỗi mạng sau khi bấm gửi/phát hành: người dùng có thể truy vấn trạng thái; thao tác lặp có mã định danh/idempotency ở mức thiết kế để tránh phát hành hai lần.
- Gỡ hoặc xóa tin đang được liên kết từ trang khác: cảnh báo tham chiếu, yêu cầu xác nhận và lưu nhật ký; không xóa tệp dùng chung.
- Nội dung có mã nhúng hoặc HTML không an toàn: từ chối hoặc làm sạch theo allowlist; ghi nhận lỗi kiểm tra mà không làm mất nội dung hợp lệ khác.

### Ca nghiệm thu đề xuất

1. Tạo tin với tiêu đề, nội dung, chuyên mục đang hoạt động, ảnh và slug chưa dùng; lưu nháp, thoát/mở lại; đối chiếu toàn bộ trường và xác nhận chưa xuất hiện ở cổng.
2. Nhập slug trùng bài đã có; hệ thống từ chối lưu/phát hành, chỉ rõ slug xung đột và giữ các trường khác.
3. Gửi tin theo quy trình hai bước; tài khoản không được giao không thể duyệt; người bước một duyệt thì bài sang đúng bước hai, chưa ra công khai.
4. Người duyệt trả lại kèm lý do; tác giả thấy lý do và chỉnh sửa; lịch sử thể hiện người/thời điểm/trạng thái trước-sau.
5. Phát hành bài hợp lệ; xác nhận danh sách/chi tiết công khai chỉ hiện khi thỏa điều kiện trạng thái/thời điểm; gỡ bài thì URL xử lý theo quy tắc đã duyệt và nhật ký còn nguyên.
6. Tài khoản không quyền gọi thao tác sửa/xóa trực tiếp ở lớp dịch vụ; máy chủ từ chối dù giao diện không phải điểm xuất phát của yêu cầu.

## 17. Quản lý hồ sơ văn bản

**Căn cứ:** B0738.R021; B0742.R028–R029; B0746.R014. Chức năng quản lý hồ sơ văn bản bao gồm metadata, phân loại và liên kết tệp/quan hệ; việc văn bản được đăng công khai, còn hiệu lực hay thuộc một lớp văn bản cụ thể phải biểu diễn rõ ràng để công chúng tra cứu được và cán bộ cập nhật có kiểm soát.

**Bằng chứng tĩnh.** `backend/src/pages/VanBan.js` có DataGrid/form cho hồ sơ và một số trường như số/ký hiệu, ngày ban hành, hình thức, trích yếu, người ký, ngày hiệu lực, trạng thái, ngôn ngữ, nội dung, ghi chú, loại/lớp, cơ quan ban hành, lĩnh vực và thông tin hiệu lực. `api/Controllers/API/VanBansController.cs` có GET với lọc theo lớp và quan hệ; POST/PUT ánh xạ một số trường và quan hệ lớp/cơ quan/lĩnh vực; có kiểm tra `ModelState`. `web/Models/VanBan.cs` liệt kê nhiều trường ngày, hiệu lực, file gốc và các navigation relation. Có controller riêng cho quan hệ file và văn bản liên quan: `VanBan_FilesController.cs`, `VanBan_LienQuanController.cs`. Tuy nhiên, đoạn mã CRUD công khai ở controller không gắn `[Authorize]` tại lớp (có dòng `[Authorize]` bị comment); điều này là dấu hiệu cần rà soát bảo mật trong toàn tuyến, không đủ cơ sở kết luận cấu hình truy cập tổng thể. Mã nguồn hiện có không tự chứng minh phân quyền/duyệt/đầu ra công khai đạt yêu cầu.

### Vai trò, phạm vi và màn hình

Người nhập hồ sơ chịu trách nhiệm nhập metadata/tệp; chuyên viên pháp chế hoặc đầu mối văn bản rà soát thông tin hiệu lực và quan hệ; người có thẩm quyền duyệt hoặc xác nhận phát hành; quản trị danh mục quản lý hình thức, lớp, lĩnh vực và cơ quan tham chiếu. Nghiệp vụ QPPL và CĐĐH có thể dùng chung màn hình nhưng phải giữ loại nghiệp vụ để áp dụng đúng trường bắt buộc, quy tắc kiểm tra và tra cứu. Chỉ người được phép trong phạm vi tổ chức mới được sửa hoặc xóa; khách truy cập tra cứu theo tập văn bản được công khai.

Danh sách quản trị cần có lọc theo số/ký hiệu, trích yếu, loại/hình thức, lớp, cơ quan, lĩnh vực, người ký, ngôn ngữ, ngày ban hành, ngày hiệu lực, tình trạng và trạng thái đăng. Hiển thị trạng thái hiệu lực tính từ dữ liệu và ngày hiện tại; nếu dữ liệu nguồn khai báo trạng thái khác, cần chỉ ra sai khác thay vì tự sửa. Form chia phần nhận dạng (loại, số/ký hiệu, hình thức, trích yếu, ngôn ngữ), cơ quan/lĩnh vực/lớp, mốc thời gian, nội dung/tệp, quan hệ thay thế/sửa đổi/liên quan và phát hành/ghi chú. Giao diện tệp cần cho biết tên, loại, dung lượng, thứ tự, phiên bản và kết quả kiểm tra, tránh lộ đường dẫn lưu trữ nội bộ.

`[FIG:document-lifecycle]`

### Luồng xử lý chính

1. Chuyên viên chọn nhóm hồ sơ (QPPL, CĐĐH hoặc nhóm khác đã được Chủ đầu tư xác nhận), chọn ngôn ngữ và nhập số/ký hiệu, hình thức, trích yếu, cơ quan ban hành, người ký cùng các mốc thời gian theo hồ sơ gốc.
2. Hệ thống đưa danh sách tham chiếu từ danh mục đã quản trị. Người dùng gán một hoặc nhiều lớp/lĩnh vực/cơ quan theo nghiệp vụ; các quan hệ lưu cùng giao dịch hoặc theo cơ chế đảm bảo nhất quán để không để lại hồ sơ thiếu liên kết khi xảy ra lỗi giữa chừng.
3. Người dùng tải tệp gốc và tệp công bố/đính kèm nếu khác nhau, kiểm tra xem trước/tải xuống. Lưu mã tệp và metadata; không ghi đường dẫn tùy ý vào giao diện công khai. Nội dung mô tả văn bản có thể được nhập hoặc trích xuất có kiểm soát, nhưng bản gốc là căn cứ.
4. Người dùng bổ sung tình trạng hiệu lực, ngày hiệu lực/hết hiệu lực, hết hiệu lực một phần và văn bản bị tác động nếu áp dụng; gắn văn bản sửa đổi, thay thế hoặc liên quan qua quan hệ có kiểu và chiều rõ ràng.
5. Lưu nháp để rà soát; trình người có thẩm quyền kiểm tra bản ghi so với hồ sơ gốc. Phê duyệt hồ sơ và đưa lên công khai là hai thao tác có thể tách quyền. Khi được duyệt và xuất bản, hồ sơ trở thành kết quả tra cứu; các lần sửa sau lưu phiên bản và có thể cần duyệt lại.
6. Khi thông tin hiệu lực thay đổi hoặc có văn bản tác động, chuyên viên cập nhật bản ghi liên quan và xác nhận quan hệ hai đầu. Trạng thái trên cổng phải nêu mốc và căn cứ, không chỉ đổi nhãn bằng thao tác thủ công thiếu nhật ký.

### Dữ liệu logic đề xuất

| Đối tượng | Trường nghiệp vụ chính | Ghi chú |
|---|---|---|
| Hồ sơ văn bản | mã; nhóm nghiệp vụ; số/ký hiệu; hình thức; trích yếu; nội dung; ngôn ngữ; cơ quan; người ký/chức danh; ngày ban hành/ký/công bố; trạng thái hồ sơ | “Nhóm nghiệp vụ” đề xuất, không khẳng định trường hiện có |
| Hiệu lực | ngày hiệu lực; ngày hết hiệu lực; còn hiệu lực; hết hiệu lực một phần; tình trạng; ghi chú/căn cứ | Tách ngày và tình trạng nguồn để xử lý dữ liệu không thống nhất |
| Phân loại | lớp văn bản; lĩnh vực; cơ quan ban hành | Quan hệ nhiều-nhiều nếu nghiệp vụ yêu cầu; danh mục do vai trò quản trị sửa |
| Tệp văn bản | mã hồ sơ; mã tệp; loại tệp (gốc/công bố/phụ lục); thứ tự; tên hiển thị; phiên bản | Đường dẫn lưu trữ thuộc tầng tệp, không phải trường nhập tự do |
| Quan hệ văn bản | hồ sơ nguồn; hồ sơ đích; kiểu quan hệ; phạm vi tác động; ghi chú | Kiểu quan hệ cần thống nhất: sửa đổi, thay thế, bãi bỏ, liên quan |

### Quy tắc, trạng thái và quyền

Số/ký hiệu và trích yếu bắt buộc theo phạm vi hồ sơ; kiểm tra chuẩn hóa khoảng trắng/ký tự, nhưng không tự đổi dữ liệu pháp lý. Ngày ban hành/hiệu lực/hết hiệu lực có thể thiếu nếu hồ sơ chưa có thông tin; nếu đủ các mốc thì phát hiện ngày hết hiệu lực sớm hơn ngày hiệu lực, ngày ký sau ngày ban hành bất hợp lý hoặc mốc thiếu căn cứ và yêu cầu xác nhận. Không tự tính hiệu lực pháp lý chỉ từ một ngày nếu có trạng thái bị sửa đổi/bãi bỏ một phần. Tệp phải còn tồn tại, mở được, có loại được chấp nhận; kiểm tra trùng số/ký hiệu theo phạm vi loại/ngôn ngữ/cơ quan do Chủ đầu tư quyết định.

Luồng khái niệm: Đang nhập → Chờ rà soát → Cần bổ sung/Đã rà soát → Được xác nhận → Công khai → Hết hiệu lực/Gỡ công khai. “Hết hiệu lực” là thuộc tính pháp lý; “gỡ công khai” là trạng thái hiển thị, không được nhập làm một. Sửa hồ sơ công khai tạo lịch sử và có thể yêu cầu rà soát lại. Quyền cần phân tách nhập, sửa, quản lý danh mục, duyệt/xác nhận, xuất bản/gỡ và xóa/lưu trữ. Mọi lệnh ghi dữ liệu phải kiểm tra phạm vi quyền tại máy chủ; đặc biệt cần rà soát route controller đang có dấu hiệu chưa gắn authorize ở cấp lớp.

### Ngoại lệ và ca nghiệm thu

Nếu số/ký hiệu đã tồn tại, người dùng xem bản ghi trùng để chọn sửa hoặc xác nhận hồ sơ khác biệt; không tự động gộp. Nếu tài liệu gốc thiếu ngày, lưu được trạng thái “chưa xác định” theo chính sách, nhưng không hiển thị khẳng định hiệu lực. Nếu một văn bản tác động tới nhiều hồ sơ, yêu cầu chọn hồ sơ đích và loại tác động, hiển thị cảnh báo khi chỉ cập nhật một đầu. Nếu tệp bị mất sau khi liên kết, báo lỗi và đưa vào danh sách cần xử lý; không xóa metadata âm thầm. Nếu lỗi cập nhật quan hệ sau khi lưu hồ sơ, giao dịch phải rollback hoặc có cơ chế phục hồi/đánh dấu lỗi để tránh bản ghi nửa vời.

Ca nghiệm thu đề xuất: (1) tạo hồ sơ QPPL có nhiều lĩnh vực, cơ quan và tệp gốc; đối chiếu lại quan hệ sau khi tải trang; (2) nhập ngày hết hiệu lực nhỏ hơn ngày hiệu lực và xác nhận lỗi định vị trường; (3) tạo quan hệ văn bản sửa đổi và xác nhận hai đầu/kiểu quan hệ; (4) người nhập không có quyền công khai thử thao tác API trực tiếp và bị từ chối; (5) hồ sơ công khai được cập nhật tình trạng một phần, giữ lịch sử và công khai đúng cảnh báo sau khi duyệt; (6) tệp bị lỗi hoặc không còn quyền tải không thể được trình duyệt như tệp hợp lệ.

## 18. Quản lý Chuyên trang Bộ trưởng

**Căn cứ:** B0738.R022; B0742.R030–R031; B0746.R015. Phân hệ quản lý chuyên trang phải đảm bảo nội dung của lãnh đạo và cấu hình hiển thị được gắn đúng chuyên trang, trình tự ưu tiên và người chịu trách nhiệm; tận dụng phân hệ nội dung chung khi phù hợp nhưng không làm rò nội dung sang trang thường hoặc chuyên trang khác.

**Bằng chứng tĩnh.** Có giao diện công khai `frontend/src/pages/minister/home/MinisterHomePage.tsx`, danh sách/chi tiết ở `frontend/src/pages/minister-news/NewsPage.tsx`, `NewsDetailPage.tsx`, và service `frontend/src/services/minister.ts`. Mã quản trị tổng quát gồm nội dung lãnh đạo, banner và menu (`backend/src/pages/ThongTinLanhDao.js`, `Banner.js`, `Menu_FrontEnd.js`). Bằng chứng này cho thấy các lát cắt nội dung/giao diện có liên quan; không cho thấy đủ cấu hình riêng, quy tắc duyệt, liên kết đầu-cuối hay quyền chuyên trang.

### Vai trò, phạm vi và màn hình

Đề xuất vai trò: biên tập viên chuyên trang soạn bài và cấu hình khu vực trong phạm vi được giao; đầu mối văn phòng kiểm tra phát ngôn/chỉ đạo và ưu tiên; người duyệt phê duyệt; người xuất bản phát hành; quản trị cổng quản lý mẫu, menu, vị trí và danh mục. Phạm vi bản ghi phải có khóa chuyên trang rõ ràng, để danh sách “Bộ trưởng” không phụ thuộc suy luận từ tiêu đề hoặc loại tin. Khách công khai chỉ thấy nội dung phát hành.

Màn hình danh sách thống nhất nội dung tin chuyên trang với các cột loại nội dung, tiêu đề, khu vực, thứ tự, ngày hiệu lực, trạng thái, người cập nhật và quyền hành động. Form nội dung dùng trường tin chung khi phù hợp, cộng thuộc tính chuyên trang, loại chỉ đạo/phát biểu, ảnh/tệp/media, thời gian hiển thị, vị trí banner/khối, liên kết đích và thứ tự ưu tiên. Màn hình cấu hình gồm menu, nhóm tin/khối trang chủ, banner và thiết lập bản dịch/nhận diện nếu HSYC yêu cầu. Mọi cấu hình có xem trước trước khi áp dụng.

### Luồng chính và dữ liệu

Người biên tập tạo nội dung mới hoặc chọn nội dung dùng chung theo chính sách; gắn rõ mã chuyên trang và loại bài. Với nội dung chỉ đạo/phát biểu, nhập ngày, nguồn xác thực, người phát biểu, bản ghi/tệp hoặc liên kết media; metadata hiển thị phải được soát. Người biên tập gán khu vực hiển thị (trang chủ/danh sách/khối nổi bật), thứ tự và thời gian bắt đầu/kết thúc; xem trước với dữ liệu và layout dự kiến. Nội dung đi qua quy trình duyệt tương ứng, người duyệt xác nhận cả văn bản lẫn vị trí hiển thị, người xuất bản kích hoạt. Khi hết hạn, hệ thống tự ngừng hiển thị theo lịch đã duyệt hoặc chuyển sang tác vụ cần xử lý nếu scheduler chưa được xác nhận. Cập nhật menu/banner cũng có phiên bản, người thực hiện và khả năng phục hồi cấu hình trước.

| Đối tượng logic đề xuất | Trường chính | Quan hệ/ý nghĩa |
|---|---|---|
| Nội dung chuyên trang | mã nội dung; mã chuyên trang; nội dung gốc; loại bài; tiêu đề; nguồn/ngày; trạng thái | Có thể tham chiếu tin dùng chung, không sao chép không kiểm soát |
| Vị trí hiển thị | nội dung; khu vực; thứ tự; bắt đầu/kết thúc; trạng thái | Chặn lịch trùng nếu hai mục không thể cùng giữ vị trí |
| Cấu hình chuyên trang | menu; banner; khối; nhận diện; ngôn ngữ; phiên bản | Giá trị chỉ áp dụng trong phạm vi chuyên trang |
| Nhật ký | đối tượng/cấu hình; người; hành động; thời điểm; lý do | Dùng để truy nguyên, phục hồi và đối chiếu |

Quy tắc bắt buộc gồm: không xuất bản khi chưa duyệt; kiểm tra thời gian hiệu lực; đường dẫn banner/ảnh hợp lệ; liên kết đích dùng giao thức an toàn được phép; nội dung thuộc đúng chuyên trang; không cho đặt hai mục cùng vị trí/thứ tự trong cùng khoảng thời gian nếu chính sách không cho phép. Quyền cấu hình trang chủ khác quyền biên tập bài. Trạng thái đề xuất: Nháp → Chờ duyệt → Được duyệt → Đang hiển thị → Hết lịch/Gỡ; thay đổi cấu hình đang chạy tạo phiên bản mới và có bước xác nhận.

### Ngoại lệ và ca nghiệm thu

Nếu bài được dùng ở nhiều nơi, thay đổi bài gốc phải cảnh báo nơi đang tham chiếu; nếu bài chỉ thuộc chuyên trang, hệ thống không đưa vào luồng tin chung. Lịch banner hết hạn hoặc thiếu ảnh phải bị chặn trước phát hành. Nếu một nội dung bị gỡ khi đang là mục đầu trang, hệ thống cần áp dụng phương án dự phòng đã cấu hình và ghi sự kiện. Nếu hai biên tập viên đồng thời thay đổi menu, kiểm soát xung đột phiên bản và yêu cầu tải lại.

Ca nghiệm thu: (1) tạo bài phát biểu gắn Bộ trưởng, duyệt và xác nhận chỉ xuất hiện ở vị trí đã chọn; (2) bài thuộc chuyên trang khác không lọt vào danh sách Bộ trưởng; (3) banner bắt đầu/kết thúc theo lịch và không hiển thị trước hạn; (4) người có quyền viết nhưng không quyền cấu hình không thể sửa menu cả trên UI lẫn API; (5) cấu hình mới lỗi/không hợp lệ có thể phục hồi phiên bản trước; (6) nội dung hết lịch bị ẩn theo đúng chính sách, còn lịch sử.

`[FIG:editorial-workflow]`

## 19. Quản lý trang Đảng bộ Bộ Nội vụ

**Căn cứ:** B0738.R023; B0742.R032–R033; B0746.R016. Phạm vi trang Đảng bộ là một dòng nội dung/chuyên trang độc lập cần được Chủ đầu tư xác nhận nguồn, nhận diện, danh mục, chủ sở hữu và cấu trúc trước khi triển khai. Không đồng nhất trang này với chuyên trang Nghị quyết TW4 chỉ vì hiện có route hoặc dữ liệu tên gần nhau.

**Bằng chứng tĩnh.** Tài liệu rà soát chỉ ghi nhận route `/nghi-quyet-tw4` trong `frontend/src/App.tsx` và component trang chủ Nghị quyết TW4; mapping `04.2.NghiQuyetTW4_TinTuc_TinTuc.json` cũng là mapping có nhãn Nghị quyết TW4. Chưa tìm thấy bằng chứng đủ về module quản trị riêng cho trang Đảng bộ. Bởi vậy, nội dung dưới đây là phương án hoàn thiện và phụ thuộc việc xác nhận yêu cầu/nguồn; không tuyên bố route hiện tại đã đáp ứng trang Đảng bộ.

### Phạm vi và vai trò

Chủ đầu tư xác nhận: trang Đảng bộ có phải microsite riêng hay tập hợp chuyên mục; quan hệ với Nghị quyết TW4; phạm vi tin, văn bản, lịch sử, tổ chức, banner, menu và media; nguồn nội dung; tiêu chuẩn nhận diện và người có thẩm quyền duyệt. Sau xác nhận, tạo mã chuyên trang và phạm vi dữ liệu riêng. Biên tập viên Đảng bộ quản lý nội dung; người duyệt theo cấp được giao; quản trị cổng điều hành cấu hình khung/menu; khách truy cập xem nội dung đã công khai. Nếu có nội dung dùng chung, quan hệ chia sẻ phải được xác lập explicit và có cách xử lý khi một bên gỡ bài.

Màn hình danh sách có lọc theo chuyên mục, loại nội dung, thời gian/sự kiện, trạng thái và người soạn. Form cấu hình gồm nhận diện, menu nhiều cấp, banner, khối nội dung, trang chủ, trang danh sách/chi tiết, liên kết tài liệu và nội dung nền. Màn hình biên tập cho phép xem trước cả đầu trang, danh sách, breadcrumb và chi tiết theo từng loại nội dung. Cấu hình chuyên trang không làm thay đổi giao diện các chuyên trang khác.

### Luồng, mô hình dữ liệu và kiểm soát

Sau khi chốt phạm vi, quản trị tạo cấu hình chuyên trang (mã, tên, nhận diện, domain/path, ngôn ngữ, trạng thái); khai báo menu, chuyên mục và quy trình gắn cho phạm vi đó. Người biên tập tạo bài, gắn chuyên trang và chuyên mục, điền nội dung/tệp/nguồn; có thể tham chiếu bản ghi dùng chung nhưng phải xem rõ quyền và nơi hiển thị. Bản ghi đi qua quy trình duyệt và phát hành; API/khối công khai lọc theo mã chuyên trang và trạng thái, không chọn chỉ từ URL. Quản trị thay đổi menu/banner tạo phiên bản cấu hình có xem trước và bước xác nhận. Migration (nếu thực hiện) cần giữ khóa nguồn, quy tắc gán chuyên mục, báo cáo bản ghi không ánh xạ và đối soát riêng; mapping Nghị quyết TW4 không được tái sử dụng làm chứng cứ cho dữ liệu Đảng bộ cho tới khi Chủ đầu tư xác nhận tương đương.

| Đối tượng logic đề xuất | Trường | Quy tắc |
|---|---|---|
| Chuyên trang | mã; tên; nhận diện; đường dẫn; ngôn ngữ; trạng thái; chủ sở hữu | mã ổn định, không đổi theo tên hiển thị |
| Nội dung | mã; mã chuyên trang; loại; chuyên mục; nội dung; nguồn; trạng thái; lịch phát hành | mặc định chỉ thuộc một phạm vi; chia sẻ phải tường minh |
| Điều hướng | mã chuyên trang; nút cha/con; nhãn; URL đích; thứ tự; trạng thái | không có vòng lặp, không trỏ nội dung không truy cập |
| Cấu hình hiển thị | vùng; đối tượng; thứ tự; thời hạn; phiên bản | cô lập theo chuyên trang |
| Ánh xạ dữ liệu (nếu di trú) | hệ nguồn; khóa nguồn/đích; kết quả; lỗi; thời điểm | phục vụ đối soát, không thay cho nghiệm thu |

Phân quyền theo mã chuyên trang và thao tác; người không thuộc phạm vi không được đọc bản nháp. Trạng thái đề xuất dùng chung với hệ biên tập nhưng cần xác nhận quy trình Đảng bộ. Slug/URL phải duy nhất trong cấu trúc đã chốt; thay cấu trúc đường dẫn phải có bảng chuyển hướng; nội dung không có chuyên trang hợp lệ bị chặn xuất bản. Khi đổi menu, kiểm tra liên kết gãy và hiển thị cảnh báo.

`[FIG:rbac]`

### Ngoại lệ và ca nghiệm thu

Nếu Chủ đầu tư chưa xác nhận quan hệ giữa Đảng bộ và TW4, dữ liệu vẫn được tách và chờ ánh xạ; không nhập chung để tiết kiệm thao tác. Nếu liên kết nguồn bị thiếu, bản ghi di trú ở hàng chờ lỗi, không tự gán vào chuyên mục tương tự. Nếu người biên tập bị thu hồi quyền giữa phiên, máy chủ từ chối lần ghi kế tiếp. Nếu menu trỏ tới trang không công khai, không phát hành cấu hình và hiển thị nguyên nhân.

Ca nghiệm thu: (1) tạo nội dung Đảng bộ và xác nhận phạm vi dữ liệu chỉ xuất hiện ở trang Đảng bộ; (2) thử truy cập bản nháp của trang bằng tài khoản ngoài phạm vi và bị từ chối; (3) tạo menu nhiều cấp, kiểm tra thứ tự, URL và phát hiện vòng lặp; (4) thay đổi cấu hình trang chủ, xem trước rồi phát hành; route khác không bị ảnh hưởng; (5) chạy đối soát mẫu mapping đã được Chủ đầu tư duyệt, báo cáo đủ số bản ghi ánh xạ/lỗi và truy nguyên khóa nguồn; (6) xác nhận riêng bằng biên bản mối quan hệ/khác biệt giữa nội dung TW4 và phạm vi Đảng bộ.

## 20. Quản lý đa phương tiện

**Căn cứ:** B0738.R024; B0742.R034–R035; B0746.R017. Phân hệ quản lý album và các mục media ảnh/video/audio, chuyên mục, tệp và hiển thị. Mục tiêu quản trị là giữ metadata và liên kết tệp nhất quán, để trang công khai chỉ đưa ra nội dung đã được duyệt và phát được bằng định dạng/phương thức được phép.

**Bằng chứng tĩnh.** Có các trang quản trị `backend/src/pages/ABL_AlbumAnh.js`, `ABL_AlbumVideo.js`, `ABL_AlbumAudio.js`; API album ảnh `api/Controllers/API/ABL_AlbumAnhController.cs` và các controller tệp/album tương ứng được rà. Ma trận ghi nhận các cấu phần này nhưng chưa chứng minh upload hàng loạt, quy tắc nhúng ngoài, quyền, khả năng phát ở môi trường đích hay đầu ra công khai đầy đủ.

### Vai trò, giao diện và luồng

Người phụ trách media tạo album và nhập metadata; biên tập viên phân loại, sắp xếp, gắn ảnh bìa và chú thích; người duyệt xác nhận quyền sử dụng/nội dung; người xuất bản kích hoạt; quản trị viên quản lý danh mục, dung lượng và nguồn nhúng được phép. Màn hình danh sách gom các loại media nhưng có bộ lọc theo loại, chủ đề, chuyên mục, trạng thái, thời gian và người tạo. Màn hình album có tab thông tin, danh sách mục, sắp xếp, bản xem trước và lịch sử. Form mục media tách tệp gốc, bản chuyển mã/thumbnail nếu có, caption, mô tả thay thế, nguồn/tác giả, ngày, vị trí và quyền sử dụng. Không coi URL ngoài là tệp đã được quản lý.

Luồng đề xuất: chọn loại album → tạo tiêu đề/mô tả/chuyên mục/ngôn ngữ → tải một hoặc nhiều file qua dịch vụ file → hệ thống kiểm tra định dạng, kích thước, tên và nội dung tệp theo chính sách → người dùng sắp xếp, chọn ảnh bìa, nhập caption/alt text và bản quyền → xem trước → trình duyệt → phê duyệt/xuất bản. Với video/audio nhúng, chỉ nhận nhà cung cấp/URL nằm trong allowlist và lưu URL chuẩn hóa, tên nguồn cùng quyền sử dụng; nội dung nhúng không chạy trong vùng quản trị không an toàn. Sửa album đang công khai tạo phiên bản metadata; việc thay/xóa tệp đang được tham chiếu có cảnh báo và quy trình duyệt.

| Đối tượng logic đề xuất | Trường chính | Ghi chú |
|---|---|---|
| Album | mã; loại media; tiêu đề; mô tả; chuyên mục; ảnh bìa; ngôn ngữ; trạng thái; người/giờ | Một album có nhiều mục; loại album cố định sau khi tạo hoặc đổi có kiểm soát |
| Mục media | mã album; mã tệp hoặc URL nguồn; thứ tự; chú thích; alt text; thời lượng/kích thước; bản quyền | Tùy loại, trường kỹ thuật có thể do dịch vụ trích xuất |
| Nguồn nhúng | nhà cung cấp; URL chuẩn; mã nội dung; cho phép nhúng; trạng thái xác minh | Không tải URL tùy ý từ máy chủ nếu chưa có kiểm soát SSRF |
| Nhật ký tệp | mã tệp; kết quả kiểm tra; người tải; phiên bản; liên kết | Có thể truy ra album sử dụng tệp |

### Quy tắc, trạng thái và ngoại lệ

Chỉ kiểu MIME/đuôi/dung lượng được cho phép theo chính sách cấu hình; không tin MIME do trình duyệt tự khai. Tệp virus/nguy cơ, tệp hỏng hoặc trùng checksum phải được xử lý theo quy trình duyệt/loại bỏ đã thống nhất. Ảnh công khai cần thumbnail/alt text theo yêu cầu khả năng tiếp cận; video/audio cần poster/caption hoặc mô tả nếu HSYC yêu cầu. Thứ tự là duy nhất trong album; album công khai cần ít nhất một mục hợp lệ, trừ album chỉ có nội dung nhúng được phê duyệt. Liên kết nguồn chết hoặc bị nhà cung cấp chặn được đánh dấu cần xử lý và không phát tự động. Trạng thái đề xuất: Nháp → Chờ duyệt → Đã duyệt → Công khai → Tạm ẩn/Ngừng phát hành. Gỡ album không xóa file dùng chung; xóa file chỉ khi không còn tham chiếu và được quyền.

Ngoại lệ gồm: upload một phần thất bại thì báo từng tệp và giữ lại các tệp thành công ở trạng thái nháp; tải lại trùng không tạo bản sao ngoài chính sách; lỗi chuyển mã giữ tệp gốc nhưng không cho hiển thị nếu trải nghiệm phụ thuộc bản chuyển mã; URL nhúng sai domain bị chặn; xóa mục đang được nội dung khác sử dụng phải cảnh báo; thao tác sắp xếp đồng thời phải phát hiện phiên bản xung đột.

`[FIG:document-lifecycle]`

### Ca nghiệm thu đề xuất

1. Tạo album ảnh gồm nhiều tệp, gán thumbnail, chuyên mục, alt text và thứ tự; công khai xem được đúng thứ tự.
2. Tải tệp có phần mở rộng được phép nhưng nội dung MIME không khớp; máy chủ từ chối/đưa cách ly và ghi lý do.
3. Tạo video/audio từ nguồn nhúng nằm trong allowlist; xác nhận trang công khai phát được, nguồn và chú thích hiển thị; URL ngoài allowlist bị từ chối.
4. Tài khoản biên tập không thể phê duyệt album của chính mình khi chính sách tách vai trò; API cũng từ chối.
5. Gỡ album có tệp dùng chung; album không còn công khai nhưng bản ghi tệp liên kết khác vẫn tồn tại.
6. Upload nhiều tệp khi một tệp lỗi; kết quả từng tệp được thông báo, không mất các tệp hợp lệ đã nhận.

## 21. Quản lý lấy ý kiến nhân dân

**Căn cứ:** B0738.R025; B0742.R036–R037; B0746.R018. Chức năng gồm hồ sơ dự thảo, công bố thời gian lấy ý kiến, tiếp nhận ý kiến công khai, kiểm duyệt, thống kê và lưu hồ sơ kết thúc. Đây là luồng tiếp nhận thông tin người dân; việc nhận được một ý kiến không có nghĩa nội dung đã được duyệt hoặc công khai.

**Bằng chứng tĩnh.** Có trang quản trị `backend/src/pages/VanBanDuThao.js`, `VanBanDuThao_GopYs.js`, controller `VanBanDuThaosController.cs`, `VanBanDuThao_GopYsController.cs`; tài liệu 02 ghi nhận form công khai có reCAPTCHA ở `frontend/src/pages/home/components/other/SentFeedbackForm.tsx` và xác minh phía máy chủ tại `api/Controllers/API/PublicController.cs`, dịch vụ kiểm tra `ReCaptchaValidator.cs`. Mức chứng cứ là một phần: chưa xác nhận đầy đủ upload, phân công, toàn bộ trạng thái, thống kê, chống spam và cách hiển thị kết quả.

### Vai trò, phạm vi và màn hình

Đơn vị chủ trì tạo hồ sơ dự thảo và thời hạn; người biên tập chuẩn bị nội dung/tệp công bố; quản lý phân công cán bộ tiếp nhận; kiểm duyệt viên phân loại, ẩn/duyệt/từ chối ý kiến; quản trị viên cấu hình biểu mẫu/chống lạm dụng; công chúng xem dự thảo và gửi ý kiến. Hồ sơ dự thảo chỉ cho phép gửi ý kiến trong khung thời gian và theo phương thức được công bố. Danh sách quản trị lọc dự thảo theo cơ quan, thời gian, trạng thái; ý kiến lọc theo hồ sơ, chủ đề, trạng thái kiểm duyệt, ngày nhận và cán bộ phụ trách. Màn hình ý kiến phải che dữ liệu cá nhân theo quyền; thống kê công khai chỉ tổng hợp, không tự động hiển thị nội dung chưa duyệt.

### Luồng xử lý chính

Đơn vị tạo dự thảo với trích yếu, nội dung/tệp, cơ quan chủ trì, thời gian bắt đầu/kết thúc, hướng dẫn gửi và chính sách công khai; trình duyệt và công bố. Khi người dân mở biểu mẫu, hệ thống hiển thị hồ sơ/thời hạn, trường ý kiến bắt buộc, trường liên hệ tùy chọn hoặc bắt buộc theo quyết định, thông báo quyền riêng tư và cơ chế chống bot. Người dùng gửi nội dung và tệp nếu được hỗ trợ; máy chủ xác minh token reCAPTCHA, kiểm tra dữ liệu/tệp, giới hạn tần suất và ghi nhận thời gian nhận. Phản hồi cho người gửi là mã tiếp nhận hoặc thông báo thành công, không tiết lộ thông tin của người khác.

Ý kiến mới vào trạng thái Chờ kiểm duyệt. Quản lý có thể phân công theo hồ sơ/chủ đề, kiểm duyệt viên đọc nội dung, đánh dấu nội dung không liên quan/trùng/vi phạm, duyệt công khai hoặc từ chối/ẩn kèm lý do nội bộ. Nếu phải trả lời chính thức, trường trả lời liên kết với ý kiến nhưng không thay ý kiến gốc. Khi hết thời hạn, biểu mẫu ngừng nhận; đơn vị tổng hợp số liệu, lập báo cáo và quyết định nội dung nào được công khai. Bất kỳ tái mở đợt tham vấn nào cũng cần thời hạn/quyết định mới và lịch sử.

| Đối tượng logic đề xuất | Trường chính | Ghi chú |
|---|---|---|
| Hồ sơ dự thảo | mã; tên/trích yếu; cơ quan; tệp; thời gian mở/đóng; trạng thái; hướng dẫn | Ngày đóng là thời điểm máy chủ; múi giờ phải thống nhất |
| Ý kiến | mã; hồ sơ; nội dung; thời điểm; thông tin người gửi được phép thu; tệp; token/chống spam dạng kết quả | Không lưu token reCAPTCHA như dữ liệu định danh lâu dài |
| Phân công | ý kiến/hồ sơ; cán bộ; thời điểm; người giao; trạng thái | Quyền xem dữ liệu cá nhân theo phạm vi |
| Kiểm duyệt/trả lời | quyết định; lý do nội bộ; nội dung trả lời; người; thời điểm; trạng thái công khai | Không sửa nội dung gốc; sửa phải là bản chỉnh có truy vết |
| Thống kê | số nhận; số hợp lệ; số trùng/ẩn; phân loại; thời điểm chốt | Công khai dưới dạng tổng hợp được duyệt |

### Quy tắc, quyền và xử lý ngoại lệ

Không nhận ý kiến trước thời gian mở hoặc sau thời gian đóng; việc chốt thời gian theo múi giờ được thống nhất và máy chủ là nguồn chuẩn. reCAPTCHA phải được xác minh phía máy chủ và lỗi/hết hạn dẫn tới không nhận bản ghi; token không thay thế giới hạn tần suất, kiểm tra nội dung và tệp. Tệp đính kèm nếu được cho phép phải giới hạn loại, dung lượng, quét mã độc và tránh công khai trước kiểm duyệt. Nội dung có dữ liệu nhạy cảm cần ẩn/giới hạn theo chính sách, nhật ký truy cập dữ liệu cá nhân và thời hạn lưu được Chủ đầu tư phê duyệt. Trạng thái đề xuất: Nháp dự thảo → Chờ duyệt → Đang lấy ý kiến → Đóng tiếp nhận → Tổng hợp/Hoàn tất; ý kiến: Mới nhận → Chờ kiểm duyệt → Đã duyệt công khai/Ẩn/Từ chối/Trùng; có thể thêm Đã trả lời. Chỉ kiểm duyệt viên được phân công quyết định hiển thị; quản lý được phân công nhưng không tự sửa nội dung nguồn.

Nếu xác minh reCAPTCHA lỗi, hiển thị thử lại và không tạo ý kiến. Nếu máy chủ lưu ý kiến nhưng phản hồi mạng thất bại, cần mã tiếp nhận hoặc cơ chế chống gửi lặp để người dân không tạo trùng. Nếu nội dung nghi spam, giữ chờ kiểm duyệt thay vì tự công khai. Nếu người gửi yêu cầu xóa dữ liệu cá nhân, thực hiện theo quy trình pháp lý/chính sách lưu trữ đã được duyệt và giữ thông tin nhật ký tối thiểu hợp lệ. Nếu cán bộ chuyển công tác, quản lý có thể phân công lại mà lịch sử cũ vẫn lưu.

`[FIG:feedback-moderation]`

### Ca nghiệm thu đề xuất

1. Mở đợt tham vấn, gửi ý kiến hợp lệ trước hạn; nhận mã tiếp nhận và bản ghi ở trạng thái chờ duyệt.
2. Gửi token reCAPTCHA sai/hết hạn; không có bản ghi ý kiến, giao diện đưa hướng thử lại.
3. Gửi sau giờ đóng và trước giờ mở theo múi giờ đã chốt; cả hai bị từ chối, thông báo đúng thời điểm.
4. Ý kiến có tệp không được phép hoặc vượt ngưỡng cấu hình; máy chủ từ chối tệp, ghi nhận kết quả và không công khai dữ liệu.
5. Kiểm duyệt viên duyệt một ý kiến và ẩn một ý kiến khác; trang công khai chỉ hiện ý kiến được duyệt, nhật ký ghi đủ người/lý do.
6. Đối chiếu thống kê sau khi loại bản ghi trùng/ẩn; tổng số và tiêu chí có thể truy ngược tới các bản ghi nguồn.

## 22. Quản lý văn bản QPPL và văn bản CĐĐH

**Căn cứ:** B0738.R026; B0742.R028–R029; B0746.R014. Hạng mục này nhấn mạnh hai nhóm hồ sơ có cách phân loại và bộ trường nghiệp vụ có thể khác nhau. Có thể dùng chung nền tảng lưu trữ/tra cứu với mục 17, nhưng phải chốt danh mục, trường, luồng duyệt và tiêu chí tra cứu riêng cho QPPL và văn bản chỉ đạo, điều hành (CĐĐH). Không giả định hai nhóm hoàn toàn đồng nhất.

**Bằng chứng tĩnh.** Có màn hình quản trị `backend/src/pages/VanBan.js`, API `api/Controllers/API/VanBansController.cs`, model `web/Models/VanBan.cs`. Model gồm số/ký hiệu, hình thức, ngày ban hành/ký, trích yếu, cơ quan, người ký, tệp, trạng thái/ngôn ngữ, hiệu lực, lĩnh vực, lớp và quan hệ. API GET có lọc theo lớp; CRUD ánh xạ một số trường và quan hệ. Những thành phần này là nền tảng liên quan, chưa chứng minh đủ đặc thù từng nhóm hay chất lượng lọc và phân quyền. Vì vậy, mô hình sau là đề xuất nghiệp vụ; giữ nguyên khả năng phân biệt hồ sơ, không tuyên bố thêm endpoint hiện hữu.

### Thiết kế màn hình và luồng

Danh sách có bộ lọc chọn trước loại hồ sơ, sau đó hiển thị trường phù hợp. QPPL có thể cần số/ký hiệu, hình thức, ngày ban hành, cơ quan, lĩnh vực, ngày hiệu lực, tình trạng, quan hệ sửa đổi/bãi bỏ và văn bản hợp nhất nếu nằm trong HSYC. CĐĐH có thể cần đơn vị ban hành, người ký/chức danh, phạm vi/đối tượng, thời hạn thực hiện, mức độ lưu hành và tệp; phạm vi trường cụ thể phải được Chủ đầu tư xác nhận. Không đưa trường mật/hạn chế truy cập vào kết quả công khai nếu chưa có chính sách.

Chuyên viên chọn loại hồ sơ, hệ thống nạp form tương ứng; nhập thông tin từ bản gốc, gắn cơ quan, lĩnh vực, lớp, tệp và quan hệ. Quy tắc kiểm tra đánh dấu thiếu trường theo loại; người rà soát đối chiếu bản gốc; người có quyền xác nhận phát hành. Với văn bản đã có hiệu lực, cập nhật trạng thái cần gắn căn cứ/quan hệ; hệ thống tính trạng thái hiển thị từ các trường và quyết định có thẩm quyền. Chỉ nhóm công khai được xuất bản; văn bản nội bộ/hạn chế (nếu nằm trong phạm vi) có quyền truy cập riêng.

| Nhóm logic đề xuất | Trường chung | Trường cần xác nhận riêng |
|---|---|---|
| QPPL | số/ký hiệu; hình thức; ngày ban hành; cơ quan; người ký; trích yếu; nội dung/tệp; ngày hiệu lực/hết hiệu lực; lĩnh vực; ngôn ngữ; quan hệ pháp lý | tình trạng, tác động một phần, căn cứ sửa đổi/bãi bỏ, loại hiệu lực |
| CĐĐH | số/ký hiệu; loại; cơ quan/đơn vị; người ký; ngày; trích yếu; tệp; trạng thái | đối tượng nhận; mức độ lưu hành; thời hạn/thời điểm thực hiện; cấu hình truy cập |
| Quan hệ | hồ sơ nguồn/đích; kiểu; thời điểm; căn cứ | bắt buộc/tuỳ chọn theo nhóm |

### Quy tắc và trạng thái

Chỉ tiêu tra cứu công khai phải áp dụng cùng tập dữ liệu được quyền xem. Tìm kiếm số/ký hiệu cần chuẩn hóa ký tự thường gặp nhưng giữ nguyên giá trị hiển thị gốc. Bộ lọc ngày bao gồm biên đầu/cuối nhất quán; bộ lọc cơ quan/lĩnh vực/lớp phải hỗ trợ các quan hệ đã xác nhận. Không suy ra “còn hiệu lực” nếu trường hiệu lực rỗng hoặc có quan hệ tác động chưa được giải quyết; thay bằng “chưa xác định” hoặc trạng thái được Chủ đầu tư duyệt. Trạng thái quy trình hồ sơ (nháp/chờ xác nhận/công khai/gỡ) tách khỏi hiệu lực pháp lý (còn/hết/một phần/chưa rõ). Quyền tạo/sửa, xác nhận, phát hành và truy cập tài liệu hạn chế tách biệt.

Ngoại lệ: dữ liệu nhập từ nguồn không đầy đủ được giữ ở hàng chờ và có báo cáo; văn bản trùng không tự gộp; quan hệ vòng lặp hoặc tự tham chiếu bị chặn; một văn bản vừa bị sửa đổi vừa được ghi “còn hiệu lực toàn phần” tạo cảnh báo cần xác minh; hồ sơ CĐĐH hạn chế không đưa vào API công khai; lỗi tệp không làm mất metadata nhưng ngăn công khai nếu tệp là phần bắt buộc.

### Ca nghiệm thu đề xuất

1. Tạo QPPL với ngày hiệu lực, quan hệ sửa đổi và tệp; tra cứu theo số/ký hiệu, cơ quan và khoảng ngày, kết quả khớp bản ghi.
2. Tạo CĐĐH theo form riêng; trường đặc thù được lưu/hiển thị đúng và không bị bỏ qua khi mở lại.
3. Hồ sơ có mốc hết hiệu lực đã qua nhưng chưa được xác nhận nguồn; cổng hiển thị theo quy tắc “cần xác minh”, không khẳng định sai hiệu lực.
4. Tài khoản công khai tìm hồ sơ hạn chế; kết quả và API không để lộ tiêu đề, tệp hoặc metadata không được phép.
5. Cập nhật QPPL tác động một phần; lưu căn cứ, liên kết hồ sơ bị tác động và trạng thái có thể đối chiếu.
6. Thử lọc biên ngày, lớp cha/con và nhiều cơ quan/lĩnh vực; so sánh kết quả với tập dữ liệu được duyệt.

## 23. Quản lý Hội nghị - Sự kiện

**Căn cứ:** B0738.R027; B0742.R038–R039; B0746.R019. Phân hệ quản trị sự kiện, loại sự kiện, mốc thời gian, địa điểm, thành phần, nội dung, tệp và trạng thái hiển thị. Nếu yêu cầu timeline, danh sách công khai phải sắp xếp đúng theo mốc đã thống nhất và xử lý sự kiện kéo dài/nhiều phiên.

**Bằng chứng tĩnh.** Có `backend/src/pages/SuKienHoiThao.js` và danh mục `LoaiSuKien.js`, API `api/Controllers/API/SuKienHoiThaosController.cs`, model `web/Models/SuKienHoiThao.cs`, controller tệp `SuKienHoiThao_FilesController.cs`. Tài liệu 02 chưa thấy đủ bằng chứng giao diện công khai, bộ lọc và timeline; ma trận ghi cần đối chiếu người tham gia, tệp, trạng thái và đầu ra.

### Vai trò, màn hình và luồng

Đơn vị tổ chức tạo sự kiện, chịu trách nhiệm thời gian/địa điểm/đầu mối; biên tập viên soạn tin giới thiệu và cập nhật chương trình; người duyệt kiểm tra nội dung công bố; người xuất bản đưa ra cổng; quản trị viên quản lý danh mục loại sự kiện. Màn hình danh sách lọc loại, ngày/giờ, đơn vị, trạng thái và địa điểm, đồng thời hiển thị sự kiện sắp tới/đã qua theo mốc. Form có thông tin chung, thời gian, địa điểm, mô tả, chương trình, thành phần công khai, hình ảnh, tệp và liên kết nội dung/tin. Timeline dùng dữ liệu sự kiện đã duyệt, cho phép cấu hình cách biểu diễn nhiều ngày/phiên khi được xác nhận.

Luồng: tạo bản nháp → nhập loại, tiêu đề, thời gian bắt đầu/kết thúc, địa điểm, đơn vị tổ chức và mô tả → thêm phiên/hoạt động nếu có → gắn ảnh/tệp/chương trình → xem trước → gửi duyệt → phê duyệt/xuất bản. Sau khi kết thúc, sự kiện không bị xóa; có thể lưu trữ/đánh dấu đã diễn ra, giữ trang chi tiết và tài liệu nếu chính sách yêu cầu. Cập nhật giờ/địa điểm sau khi công bố phải ghi phiên bản và yêu cầu duyệt lại; thông báo thay đổi cho công chúng phụ thuộc phạm vi HSYC.

| Đối tượng logic đề xuất | Trường | Quy tắc |
|---|---|---|
| Sự kiện | mã; tiêu đề; loại; mô tả; đơn vị; địa điểm; múi giờ; bắt đầu/kết thúc; trạng thái | Múi giờ chuẩn do Chủ đầu tư xác nhận |
| Phiên | mã sự kiện; tên; bắt đầu/kết thúc; địa điểm; thứ tự; nội dung | Không chồng mốc trái logic; thứ tự ổn định |
| Thành phần | tên/đơn vị/chức vụ hoặc nhóm; mức công khai; thứ tự | Chỉ thu thập dữ liệu cá nhân cần thiết |
| Tệp/liên kết | mã sự kiện; mã tệp; loại; URL; chú thích | Chỉ loại/URL hợp lệ |
| Nhật ký | tác nhân; hành động; thời điểm; trước/sau; lý do | Bao gồm thay đổi lịch đã công khai |

### Quy tắc, trạng thái và ngoại lệ

Thời gian kết thúc không trước thời gian bắt đầu; mọi mốc lưu theo quy ước múi giờ và hiển thị nhất quán. Sự kiện nhiều ngày có trường thời gian rõ; timeline sắp theo giờ bắt đầu thay vì ngày nhập. Loại sự kiện đang được sử dụng không thể xóa cứng; phải ẩn/ngừng dùng. Trạng thái quy trình: Nháp → Chờ duyệt → Đã duyệt → Sắp diễn ra/Đang diễn ra/Đã diễn ra (trạng thái thời gian) → Lưu trữ/Gỡ. Trạng thái biên tập và trạng thái theo lịch là hai chiều riêng. Quyền sửa sự kiện và xác nhận xuất bản phân tách. Không công khai thông tin thành phần không được phép hoặc tệp nội bộ.

Nếu thay đổi giờ sau khi đã công bố, yêu cầu duyệt lại và ghi lý do; nếu nhiều phiên chồng giờ, cảnh báo nhưng cho phép khi người có thẩm quyền xác nhận. Nếu chưa có mốc kết thúc, cho phép chỉ khi loại sự kiện quy định hoặc cần xác nhận; nếu tệp chương trình không tải được, không đánh dấu hoàn tất phát hành khi tệp là bắt buộc. Nếu loại sự kiện bị ngừng sử dụng giữa lúc soạn, giữ giá trị lịch sử và yêu cầu chọn loại hiện hành trước lần gửi mới.

`[FIG:event-flow]`

### Ca nghiệm thu đề xuất

1. Tạo sự kiện tương lai có tệp chương trình; duyệt và xác nhận hiển thị trên danh sách đúng thứ tự thời gian.
2. Nhập giờ kết thúc trước giờ bắt đầu; hệ thống từ chối lưu và đánh dấu cả hai trường.
3. Tạo sự kiện nhiều ngày/nhiều phiên; timeline hiển thị đúng thứ tự, múi giờ và trạng thái sắp diễn ra/đã diễn ra.
4. Thay đổi địa điểm sau khi công khai; hệ thống lưu phiên bản và yêu cầu duyệt lại, không cập nhật công khai âm thầm.
5. Người dùng không có quyền duyệt gọi trực tiếp thao tác công khai; máy chủ từ chối.
6. Ẩn loại sự kiện đang được hồ sơ cũ sử dụng; sự kiện lịch sử vẫn hiển thị loại và dữ liệu không bị mất.

## 24. Quản trị hệ thống và người dùng

**Căn cứ:** B0738.R028; B0742.R040–R041; B0746.R020. Quản trị hệ thống bao gồm tài khoản, nhóm/vai trò/quyền, menu quản trị, cấu hình nội dung dùng chung, banner/khối và danh mục tham chiếu. Cần kiểm tra quyền theo nguyên tắc tối thiểu ở cả giao diện lẫn máy chủ/API; việc ẩn nút chỉ cải thiện trải nghiệm, không phải kiểm soát an ninh.

**Bằng chứng tĩnh.** Giao diện quản trị có `backend/src/pages/User_Account.js`, `Role.js`, `Menu_Backend.js`; API có `User_AccountController.cs`, `RolesController.cs`, `PermissionsController.cs`, và cơ chế authorization tại `api/OAuth/Providers/RoleAuthorizeAttribute.cs`, `PermissionAuthorizeAttribute.cs`. Có cấu phần quản lý banner, block, menu công khai, tham số/cấu hình. Tài liệu rà soát kết luận có thành phần nhưng chưa xác nhận ma trận quyền nhất quán trên mọi API/chức năng. Vì vậy, phân cấp và kiểm soát sau đây là đề xuất để được xác nhận; không suy ra rằng mọi thao tác hiện có đã áp dụng đủ.

### Vai trò, phạm vi và giao diện

Quản trị định danh tạo/khóa tài khoản, gán vai trò và phạm vi tổ chức; quản trị phân quyền thiết kế vai trò/quyền nhưng không tự cấp quyền cao hơn thẩm quyền; quản trị nội dung sửa menu/banner/block/danh mục trong phạm vi; cán bộ biên tập chỉ dùng chức năng nghiệp vụ đã cấp; kiểm toán/giám sát đọc nhật ký và báo cáo. Tách tối thiểu quyền xem, tạo, sửa, xóa/lưu trữ, duyệt, phát hành, quản lý tài khoản, cấp quyền, cấu hình hệ thống và xem nhật ký. Quyền nhạy cảm cần nguyên tắc hai người hoặc phê duyệt bổ sung nếu Chủ đầu tư yêu cầu.

Màn hình tài khoản hiển thị mã, tên đăng nhập, đơn vị, trạng thái, vai trò, ngày tạo/cập nhật và thông tin khóa/đăng nhập cần thiết; không hiển thị mật khẩu/secret. Form tạo/sửa khóa tài khoản, đặt trạng thái, gán vai trò/phạm vi, đặt thời hạn hoặc yêu cầu đổi mật khẩu nếu chính sách. Màn hình vai trò cho phép xem quyền theo nhóm chức năng, so sánh trước/sau và xác nhận; không cho cấp trực tiếp quyền quản trị quyền. Màn hình menu/cấu hình có bản xem trước, phiên bản, trạng thái bật/tắt, thứ tự và nhật ký. Danh mục dùng chung có thông tin số lượng tham chiếu trước khi ngừng/xóa.

### Luồng quản trị và mô hình logic

Quản trị viên có thẩm quyền tạo tài khoản bằng định danh duy nhất, xác định đơn vị và trạng thái; gán một hoặc nhiều vai trò theo ma trận đã duyệt. Người dùng nhận thông tin kích hoạt qua kênh được phê duyệt; không ghi mật khẩu vào nhật ký. Thay đổi vai trò ghi ai cấp, quyền trước/sau, lý do và thời hạn nếu tạm thời. Khi khóa/thu hồi quyền, phiên và token liên quan bị xử lý theo chính sách xác thực; thao tác tiếp theo không còn được chấp nhận.

Vai trò được định nghĩa thành tập quyền chức năng và phạm vi dữ liệu; API đánh giá quyền trên từng hành động và bản ghi. Menu quản trị chỉ được dựng từ quyền, nhưng API vẫn tự xác minh. Cấu hình banner/block/menu được sửa ở bản nháp, xem trước, duyệt nếu cần rồi kích hoạt phiên bản; rollback khôi phục phiên bản trước mà vẫn giữ nhật ký. Danh mục dùng chung chỉ được xóa khi không còn phụ thuộc; nếu đang được dùng thì ưu tiên ngừng hoạt động để giữ tính toàn vẹn dữ liệu. Nhật ký quản trị ghi sự kiện đăng nhập/quản trị theo chính sách và có quyền truy cập riêng.

| Đối tượng logic đề xuất | Trường | Kiểm soát |
|---|---|---|
| Tài khoản | mã định danh; tên đăng nhập; đơn vị/phạm vi; trạng thái; thời hạn; dấu thời gian | Không lưu mật khẩu dạng rõ; tên đăng nhập duy nhất |
| Vai trò | mã; tên; mô tả; trạng thái; quyền gắn; phạm vi | Quyền không vượt thẩm quyền của người cấp |
| Quyền | mã chức năng; hành động; phạm vi tài nguyên | Đặt tên rõ, không dùng quyền wildcard thiếu kiểm soát |
| Gán vai trò | tài khoản; vai trò; phạm vi; thời điểm; người cấp; hạn dùng | Hỗ trợ thu hồi và truy vết |
| Cấu hình | loại; giá trị; phiên bản; trạng thái; hiệu lực | Có kiểm tra schema và quy trình triển khai |
| Nhật ký kiểm toán | tác nhân; hành động; mục tiêu; kết quả; thời điểm; nguồn truy cập phù hợp | Không ghi bí mật/credential |

`[FIG:rbac]`

### Quy tắc quyền, ngoại lệ và nghiệm thu

Mặc định từ chối khi không có quyền tường minh. Kiểm tra cả quyền chức năng lẫn phạm vi tài nguyên; tài khoản có quyền sửa tin không mặc nhiên sửa mọi tin. Giao diện chỉ hiển thị hành động phù hợp; mọi API đọc/ghi riêng phải có xác thực/ủy quyền phù hợp với mức dữ liệu. Tài khoản bị khóa hoặc hết hạn không thể tiếp tục dùng token cũ theo chính sách phiên. Việc cấp quyền nhạy cảm cần lưu lý do và xác nhận; không cho tự nâng quyền. Cấu hình phải kiểm tra giá trị, tránh thay đổi làm hỏng menu hay lộ thông tin bí mật. Nhật ký phải đồng bộ giờ và có chính sách chống sửa/xóa trái phép.

Ngoại lệ: người quản trị cuối cùng không thể tự khóa mình nếu không còn người thay thế; thao tác khóa tài khoản đang là chủ sở hữu quy trình phải cảnh báo và yêu cầu phân công lại; thay đổi quyền bị lỗi thì rollback cả gán vai trò và nhật ký kết quả; xóa vai trò đang được dùng phải bị chặn hoặc chuyển đổi có xác nhận; API không sẵn sàng thì không báo thành công giả. Khi hai quản trị cùng sửa một vai trò, phát hiện phiên bản xung đột.

Ca nghiệm thu đề xuất: (1) tạo vai trò biên tập chỉ xem/sửa nội dung được giao, thử bản ghi ngoài phạm vi và bị từ chối; (2) ẩn nút sửa ở UI nhưng gọi API sửa trực tiếp, máy chủ trả từ chối; (3) thu hồi vai trò đang hoạt động, token/phiên cũ mất quyền theo chính sách; (4) người không có quyền cấp vai trò quản trị thử tự gán và bị từ chối, có nhật ký; (5) cấu hình menu sai liên kết không thể kích hoạt, bản đang chạy vẫn hoạt động; (6) thử xóa danh mục/role đang được tham chiếu và nhận cảnh báo/khóa thích hợp, dữ liệu liên kết còn nguyên.

## 29. Quản lý thông tin kết nối/tích hợp hiển thị trên Cổng

**Căn cứ:** B0738.R033; B0742.R051–R052; B0746.R026. Chức năng cho phép quản lý các liên kết hoặc thông tin kết nối cần công bố, có thể gồm tên nhóm, nhãn, mô tả, logo/ảnh, URL, vị trí trên cổng và trạng thái hiển thị. Ý nghĩa chính xác của “tích hợp” cần đối chiếu HSYC: nếu gồm liên thông dữ liệu, xác thực, API hoặc đồng bộ hệ thống thì quản lý link đơn thuần không đáp ứng; phần dưới đây chỉ mô tả lớp thông tin hiển thị cho tới khi Chủ đầu tư xác nhận phạm vi kỹ thuật.

**Bằng chứng tĩnh.** Có UI `backend/src/pages/USR_LinkQuanLy.js` với trường `TenLinkQuanLy`, `Link`, bảng tạo/sửa/xóa dùng `createCustomStore("USR_LinkQuanLys")`; model `api/Models/USR_LinkQuanLy.cs` hiện thể hiện `ID`, `TenLinkQuanLy`, `Link`. Ma trận và tài liệu 02 chưa tìm thấy controller riêng hay đầu ra công khai tương ứng trong điểm đã rà. Do vậy, không thể khẳng định CRUD đã hoạt động đầu cuối, có nhóm/mô tả/logo/vị trí hoặc đã hiển thị trên Cổng.

### Vai trò, màn hình và luồng

Quản trị nội dung liên kết tạo nhóm/liên kết; người duyệt kiểm tra tên, đích và ý nghĩa; người xuất bản kích hoạt; khách truy cập dùng liên kết công khai. Nếu liên kết có tính chất kỹ thuật (endpoint, webhook, đồng bộ), cấu hình thuộc về vai trò tích hợp được kiểm soát riêng và không đưa secret vào trường hiển thị. Màn hình danh sách lọc theo nhóm, vị trí, trạng thái, thời hạn và người cập nhật; form chỉnh tên, URL, mô tả, logo, vị trí, thứ tự, ngôn ngữ, target/window và thời hạn. Có thể xem trước khu vực footer/sidebar/khối đã chọn. Các vị trí cụ thể cần xác nhận theo thiết kế cổng.

Luồng đề xuất: tạo nhóm liên kết; nhập thông tin, URL chuẩn, logo, vị trí và thứ tự; hệ thống kiểm tra URL; người soạn xem trước; người duyệt kiểm tra đích nội bộ/ngoài; người xuất bản kích hoạt. Cổng chỉ hiển thị liên kết đang hoạt động, đúng thời hạn và được phê duyệt. Thay URL đang công khai tạo phiên bản và buộc rà soát lại. Nếu yêu cầu chỉ là danh bạ link, quản lý metadata là đủ; nếu có tích hợp máy-máy, cần một thiết kế riêng gồm cơ chế xác thực, chứng thư/secret, endpoint, timeout, retry, nhật ký và giám sát, không đặt bí mật trong UI danh mục.

| Đối tượng logic đề xuất | Trường chính | Ghi chú |
|---|---|---|
| Nhóm liên kết | mã; tên; mô tả; vị trí; thứ tự; trạng thái | Có thể lồng nhóm nếu HSYC xác nhận |
| Liên kết | mã nhóm; tên hiển thị; mô tả; URL; logo; ngôn ngữ; thứ tự; trạng thái; thời hạn | Không dùng URL làm khóa nghiệp vụ |
| Phiên bản | người sửa; trước/sau; lý do; thời điểm; trạng thái duyệt | Giữ lịch sử URL đã phát hành |
| Cấu hình tích hợp (chỉ khi được xác nhận) | loại kết nối; định danh hệ thống; cấu hình endpoint; trạng thái kiểm tra | Bí mật lưu trong kho an toàn, không trong trường công khai |

### Quy tắc, quyền và ngoại lệ

Chỉ giao thức và miền được phép theo chính sách; mặc định chặn URL nguy hiểm, javascript/data URI, địa chỉ cục bộ hoặc URL không chuẩn. Nếu cần domain ngoài, người duyệt xác nhận chủ sở hữu/đích; mở liên kết tab mới cần chính sách an toàn tương ứng. Logo phải nằm trong kho tệp đã kiểm tra, có kích thước và văn bản thay thế; nhóm không có link hoạt động không hiển thị tiêu đề rỗng. Tên và thứ tự bắt buộc; thứ tự trong nhóm duy nhất hoặc quy tắc ổn định. Quyền tạo/sửa khác quyền duyệt/phát hành; chỉ cấu hình được duyệt mới ra trang công khai. Với kết nối kỹ thuật, kiểm tra trạng thái không đồng nghĩa xác thực an toàn; credential phải mã hóa/quản lý vòng đời, log không ghi secret, và quy trình retry không tạo tác dụng lặp.

Ngoại lệ: URL trả lỗi hoặc chuyển hướng sang miền ngoài danh sách phải đánh dấu cần xem xét; nếu miền ngừng hoạt động, quản trị có thể tạm ẩn trong khi vẫn lưu lịch sử. Xóa nhóm đang có liên kết cần yêu cầu di chuyển hoặc ngừng hoạt động; không xóa các liên kết ẩn ngầm. Logo không tồn tại chặn phát hành hoặc thay placeholder theo chính sách. API quản trị/đầu ra công khai chưa được chứng minh: trước nghiệm thu cần xác nhận controller/service, kiểm soát quyền và thành phần frontend tiêu thụ dữ liệu, không kết luận từ model/UI riêng lẻ.

### Ca nghiệm thu đề xuất

1. Tạo nhóm và liên kết có logo, mô tả, vị trí footer, thứ tự; duyệt và xác nhận cổng hiển thị đúng khu vực.
2. Nhập URL với scheme bị cấm hoặc miền nội bộ; máy chủ từ chối, không phát hành và lưu thông báo lỗi.
3. Thay đích liên kết đang công khai; phiên bản mới chờ duyệt, phiên bản cũ tiếp tục hoạt động cho tới khi phê duyệt.
4. Tài khoản chỉ được biên tập link không thể kích hoạt/công khai hoặc thao tác API trực tiếp.
5. Ẩn nhóm có liên kết đang dùng; hệ thống cảnh báo, giữ lịch sử và không tạo nhóm rỗng công khai.
6. Nếu HSYC xác nhận tích hợp máy-máy, kiểm thử riêng kết nối thành công/thất bại, hết hạn credential, timeout/retry, nhật ký không chứa bí mật và xử lý tác dụng lặp; chỉ ghi đạt theo biên bản thực tế.

`[FIG:rbac]`

## Nguyên tắc hợp đồng dữ liệu, nhật ký và nghiệm thu liên phân hệ

Các mô hình logic trên là danh mục yêu cầu, không phải lược đồ vật lý hay hợp đồng endpoint đã triển khai. Khi bước vào thiết kế chi tiết, mỗi thao tác cần được ánh xạ tới API hiện hữu hoặc API cần xây dựng; nêu rõ phương thức, xác thực, quyền, payload, lỗi có cấu trúc, phân trang, lọc, quy tắc idempotency cho thao tác phát hành/tiếp nhận và phiên bản dữ liệu. Không đưa tên endpoint giả định vào tài liệu như thể đã có. Mọi trường nguồn phải được gắn nhãn “đã thấy trong mã”, “cần xác nhận HSYC” hoặc “đề xuất bổ sung”; các tích hợp và migration có biên bản đối soát riêng.

Các trạng thái nghiệp vụ phải được quản lý bằng chuyển trạng thái hợp lệ thay vì cho người dùng nhập tự do. Một thao tác phát hành cần lưu trạng thái trước/sau, bản ghi/phiên bản, tác nhân, thời điểm máy chủ, lý do và kết quả. Lỗi gửi phản hồi hoặc timeout cần cho phép tra cứu kết quả trước khi lặp hành động. Những nội dung đã công khai khi sửa cần có lịch sử so sánh; tác vụ gỡ không được hiểu là xóa bản gốc hoặc tệp dùng chung. Các ca quyền cần gọi cả giao diện và API trực tiếp, bao gồm tài khoản hết hạn, bị khóa, ngoài phạm vi và token còn hiệu lực sau khi thu hồi.

Nghiệm thu từng mục cần bộ dữ liệu đã duyệt, tài khoản theo vai trò, kịch bản thực hiện, kết quả mong đợi, log/ảnh chụp có thể đối chiếu và người xác nhận. Nghiệm thu đầu cuối cần kiểm tra luồng từ tạo/sửa tới đầu ra công khai, quan hệ tệp, đường dẫn, lọc/trạng thái và lỗi ngoại lệ. Tài liệu này không khẳng định bất kỳ ca nào đã chạy hoặc đạt. Kết quả chỉ được cập nhật sau khi thử trên phiên bản triển khai, cấu hình và dữ liệu được Chủ đầu tư chấp thuận.

`[FIG:editorial-workflow]` `[FIG:document-lifecycle]` `[FIG:feedback-moderation]` `[FIG:rbac]` `[FIG:event-flow]`
