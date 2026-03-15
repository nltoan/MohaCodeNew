import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SunEditor from 'suneditor-react';
import "./Feedback.scss"
import useReCaptcha from '@/hooks/useRecaptcha';
import { sendComment } from '@/services/documents';

// 1. Validation Schema using Zod
const schema = z.object({
    fullName: z.string().min(2, "Họ Tên là trường bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ (10-11 số)").optional().or(z.literal('')),
    address: z.string().optional(),
    content: z.string().min(20, "Nội dung góp ý quá ngắn")
                        .max(50000, "Nội dung quá dài (tối đa 50,000 ký tự)")
});

type FormData = z.infer<typeof schema>;

const FeedbackForm: React.FC<{ID: string, onSubmitted:()=>void}> = ({ID, onSubmitted}) => {
    const { generateReCaptchaToken } = useReCaptcha()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            content: ''
        }
    });

    const onSubmit = async (data: FormData) => {
        await generateReCaptchaToken('sendcomment'); // this will create a new token in the localStorage
        const result = await sendComment(ID, data);
        if(result === "Success"){
            alert(`Gửi góp ý thành công!\n\nHọ tên: ${data.fullName}\nEmail: ${data.email}`);
            onSubmitted();
        } else if (result === "ReCaptcha validation failed."){
			alert(`Mã bảo mật không đúng. Vui lòng thử lại sau hoặc liên hệ CongTTDT@moha.gov.vn`);
        } else if (result === "Invalid ReCaptcha action."){
			alert(`Nghi vấn gửi thông tin bởi robot. Vui lòng thử lại sau hoặc liên hệ CongTTDT@moha.gov.vn`);
        } else if (result === "Bot activity detected."){
			alert(`Nghi vấn gửi thông tin bởi robot. Vui lòng thử lại sau hoặc liên hệ CongTTDT@moha.gov.vn`);
        } else if (result === "Invalid document."){
			alert(`Văn bản gửi ý kiến không phù hợp. Vui lòng thử lại sau hoặc liên hệ CongTTDT@moha.gov.vn`);
        } else {
			alert(`Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ CongTTDT@moha.gov.vn`);
		}
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="feedback-form">
            {/* Full Name */}
            <div className="form-group">
                <label htmlFor="fullName">
                    Họ tên <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="fullName"
                        {...register('fullName')}
                        className={`form-control ${errors.fullName ? 'has-error' : ''}`}
                        placeholder="Vui lòng nhập họ tên"
                    />
                    {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
                </div>
            </div>

            {/* Email */}
            <div className="form-group">
                <label htmlFor="email">
                    Email <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`form-control ${errors.email ? 'has-error' : ''}`}
                        placeholder="name@example.com"
                    />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>
            </div>

            {/* Phone */}
            <div className="form-group">
                <label htmlFor="phone">
                    Điện thoại
                </label>
                <div className="input-wrapper">
                    <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className={`form-control ${errors.phone ? 'has-error' : ''}`}
                        placeholder="Vui lòng nhập số điện thoại"
                    />
                    {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                </div>
            </div>

            {/* Address */}
            <div className="form-group">
                <label htmlFor="address">
                    Địa chỉ
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="address"
                        {...register('address')}
                        className={`form-control ${errors.address ? 'has-error' : ''}`}
                        placeholder="Vui lòng nhập địa chỉ"
                    />
                    {errors.address && <p className="error-message">{errors.address.message}</p>}
                </div>
            </div>

            {/* Content (SunEditor) */}
            <div className="form-group">
                <label htmlFor="content">
                    Nội dung <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <div className={`sun-editor-wrapper ${errors.content ? 'has-error' : ''}`}>
                        <Controller
                            name="content"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <SunEditor
                                    setContents={value}
                                    onChange={onChange}
                                    setOptions={{
                                        height: "300",
                                        placeholder: "Nhập nội dung góp ý của bạn...",
                                        buttonList: [
                                            ['undo', 'redo'],
                                            ['font', 'fontSize', 'formatBlock'],
                                            ['paragraphStyle', 'blockquote'],
                                            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                            ['fontColor', 'hiliteColor', 'textStyle'],
                                            ['removeFormat'],
                                            ['outdent', 'indent'],
                                            ['align', 'horizontalRule', 'list', 'lineHeight'],
                                            ['table', 'link', 'image', 'video', 'audio'],
                                            ['fullScreen', 'showBlocks', 'codeView'],
                                            ['preview', 'print']
                                        ]
                                    }}
                                />
                            )}
                        />
                    </div>
                    {errors.content && <p className="error-message">{errors.content.message}</p>}
                </div>
            </div>
            <div className="grecaptcha-badge"></div>
            {/* Submit Button */}
            <div className="form-actions">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-submit"
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi góp ý'}
                </button>
            </div>
        </form>
    );
};

export default FeedbackForm;