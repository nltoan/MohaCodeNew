import React, { useEffect, useRef, useState } from 'react';
import { mediaUrl } from '../utils/upload';
import { CKEditor } from 'ckeditor4-react';
import { LoadPanel } from 'devextreme-react/load-panel';
import './ckeditor.css'; 
import { getToken } from "../utils/token";

// Noi dung chen tu ban 25/11 co the chua anh tren host API (https://api-portal.../Upload/...):
// CSP admin production chan host nay nen anh hien trang. Doi sang host media khi mo trinh soan thao.
function fixApiMediaUrls(html) {
    const api = String(window.env.REACT_APP_API_UPLOAD_URL || '').replace(/\/+$/, '');
    const media = String(window.env.REACT_APP_UPLOAD_URL || '').replace(/\/+$/, '');
    if (typeof html !== 'string' || !api || !media || api === media) return html;
    return html.split(api + '/Upload/').join(media + '/Upload/');
}

const CKEditor4Wrapper = ({ 
    value, 
    onValueChanged, 
    instanceName = "editor1", 
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const onValueChangedRef = useRef(onValueChanged);
    onValueChangedRef.current = onValueChanged;
    // Kich thuoc truoc khi phong to; dung ref vi lenh maximize duoc tao mot lan luc editor san sang
    // (state se bi "dong bang" o gia tri cu va khung bi co lai khi thu nho).
    const originalRef = useRef({ position: '', width: '', height: '', contentHeight: '' });
    const wrapperRef = useRef(null);
    // Chi tao CKEditor khi khung da gan vao trang va on dinh: popup/form cua DevExtreme co the ve lai
    // template ngay sau khi mo; tao editor vao khung bi go se de lai loi JS cua CKEditor khi bi huy giua chung.
    const [canMount, setCanMount] = useState(false);
    useEffect(() => {
        let frame = 0;
        let stable = 0;
        let tries = 0;
        const check = () => {
            const el = wrapperRef.current;
            stable = el && el.isConnected ? stable + 1 : 0;
            if (stable >= 3) {
                setCanMount(true);
                return;
            }
            if (++tries < 600) frame = requestAnimationFrame(check);
        };
        frame = requestAnimationFrame(check);
        return () => cancelAnimationFrame(frame);
    }, []);

    // FilePicker tu doi URL file sang host media (xem mediaUrl trong utils/upload).
    const urlCkfider = `/FilePicker?type=Images`;
    const urlCkfiderVideo = `/FilePicker?type=Videos`;
    const urlUpload = `${window.env.REACT_APP_API_URL}/FileManager/CKEditorImageUpload`;
    let access_token = getToken();

    return (
        <div className="ckeditor-wrapper" ref={wrapperRef} style={{ position: 'relative', minHeight: '200px' }}>
            <LoadPanel
                visible={isLoading}
                message="Xin vui lòng đợi..."
                position={{ of: '.ckeditor-wrapper' }}
                shading={true}
            />
            {canMount && <CKEditor
                editorUrl="/ckeditor/ckeditor.js"
                initData={fixApiMediaUrls(value)}
                onNamespaceLoaded={ CKEDITOR => {
                    CKEDITOR.disableAutoInline = true; 
                }}
                config={{
                    filebrowserImageBrowseUrl: urlCkfider,
                    filebrowserImageUploadUrl: urlUpload,
                    filebrowserBrowseUrl: urlCkfiderVideo,
                    filebrowserLinkBrowseUrl: urlCkfiderVideo,
                    removePlugins: 'elementspath,scayt,wsc',
                    allowedContent: true,
                    // Giu nguyen chu co dau (UTF-8) thay vi doi thanh &aacute;...: HTML nho hon, tim kiem SQL/LIKE khop duoc.
                    entities: false,
                    // O noi dung du cao de doc/nhap; keo goc duoi de gian them theo chieu doc.
                    height: 500,
                    resize_dir: 'vertical',
                    fileTools_requestHeaders:{
                        Authorization: `Bearer ${access_token}`
                    }
                }}

                onInstanceReady={({ editor }) => {
                    // Anh tai len qua tab "Tai len"/dan/keo tha: API tra "/Upload/..."; doi sang host media
                    // (chay sau bo xu ly mac dinh cua filetools, uu tien 999).
                    editor.on('fileUploadResponse', (evt) => {
                        if (evt.data && evt.data.url) evt.data.url = mediaUrl(evt.data.url);
                    }, null, null, 1000);
                    // Dong bo gia tri khi mat focus: bam Luu/Xem truoc ngay sau khi go van khong mat noi dung.
                    editor.on('blur', () => {
                        if (onValueChangedRef.current) onValueChangedRef.current(editor.getData());
                    });
                    editor.on('key', (evt) => {
                        const path = document.querySelector('.cke_path');
                        if(path) path.classList.add('hidden');
                        if (evt.data.keyCode === 1114198 || evt.data.keyCode === '1114198') {
                            setIsLoading(true);
                        }
                    });
                    editor.on('paste', (evt) => {
                        setIsLoading(false);
                    });

                    // Overwrite the command
                    //var originalCommand = editor.getCommand('maximize');
                    editor.addCommand('maximize', {
                        modes: {
                            wysiwyg: 1,
                            source: 1
                        },
                        readOnly: 1,
                        editorFocus: 0,

                        exec: function(editor) {
                            //originalCommand.exec(editor);
                            const editorContent = editor.container.$.querySelector('.cke_contents');
                            const isMaximized = editor.container.$.classList.contains('cke_maximized');
                            const parentElem = document.getElementsByClassName('dx-item dx-multiview-item dx-item-selected');
                            if(!isMaximized) {
                                if(parentElem.length > 0) parentElem[0].style.transform='unset';
                                editor.container.addClass('cke_maximized');
                                originalRef.current = {
                                    position: editor.container.$.style.position,
                                    width: editor.container.$.style.width,
                                    height: editor.container.$.style.height,
                                    contentHeight: editorContent.style.height || `${editorContent.offsetHeight}px`,
                                };
                                editor.container.$.style.position = 'fixed';
                                editor.container.$.style.width='100%';
                                editor.container.$.style.height='100%';
                                editor.container.$.style.top = 0;
                                editor.container.$.style.left = 0;
                                editorContent.style.height = (editor.container.$.offsetHeight -90) + 'px';
                            } else {
                                if(parentElem.length > 0) parentElem[0].style.transform='translate(0px, 0px)';
                                editor.container.removeClass('cke_maximized');
                                const original = originalRef.current;
                                editor.container.$.style.position = original.position;
                                editor.container.$.style.width = original.width;
                                editor.container.$.style.height = original.height;
                                editor.container.$.style.top = 'unset';
                                editor.container.$.style.left = 'unset';
                                editorContent.style.height = original.contentHeight;
                            }
                        },
                    });
                }}

                onChange={({ editor }) => {
                    const data = editor.getData();
                    if (onValueChanged) {
                        onValueChanged(data);
                    }
                }}
                name={instanceName}
            />}
        </div>
    );
};

export default CKEditor4Wrapper;
