import React, { useState } from 'react';
import { encodeBase64Url } from '../utils/helpers';
import { CKEditor } from 'ckeditor4-react';
import { LoadPanel } from 'devextreme-react/load-panel';
import 'devextreme/dist/css/dx.light.css'; 
import './ckeditor.css'; 

const CKEditor4Wrapper = ({ 
    value, 
    onValueChanged, 
    instanceName = "editor1", 
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [originalPosition, setOriginalPosition] = useState('');
    const [originalWidth, setOriginalWidth] = useState('');
    const [originalHeight, setOriginalHeight] = useState('');
    const [originalContentHeight, setOriginalContentHeight] = useState('');
    
    const urlCkfider = `/FilePicker?type=Images&s1=${encodeBase64Url(window.env.REACT_APP_API_UPLOAD_URL)}`;
    const urlCkfiderVideo = `/FilePicker?type=Videos&s1=${encodeBase64Url(window.env.REACT_APP_API_UPLOAD_URL)}`;
    const urlUpload = `${window.env.REACT_APP_API_URL}/FileManager/CKEditorImageUpload`;
    let access_token = localStorage.getItem("access_token");

    return (
        <div className="ckeditor-wrapper" style={{ position: 'relative', minHeight: '200px' }}>
            <LoadPanel
                visible={isLoading}
                message="Xin vui lòng đợi..."
                position={{ of: '.ckeditor-wrapper' }}
                shading={true}
            />
            <CKEditor
                editorUrl="/ckeditor/ckeditor.js"
                initData={value}
                onNamespaceLoaded={ CKEDITOR => {
                    CKEDITOR.disableAutoInline = true; 
                }}
                config={{
                    filebrowserImageBrowseUrl: urlCkfider,
                    filebrowserImageUploadUrl: urlUpload,
                    filebrowserBrowseUrl: urlCkfiderVideo,
                    removePlugins: 'elementspath', 
                    allowedContent: true,
                    fileTools_requestHeaders:{
                        Authorization: `Bearer ${access_token}`
                    }
                }}

                onInstanceReady={({ editor }) => {
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
                                setOriginalPosition(editor.container.$.style.position);
                                setOriginalWidth(editor.container.$.style.width);
                                setOriginalHeight(editor.container.$.style.height);
                                setOriginalContentHeight(editorContent.offsetHeight);
                                editor.container.$.style.position = 'fixed';
                                editor.container.$.style.width='100%';
                                editor.container.$.style.height='100%';
                                editor.container.$.style.top = 0;
                                editor.container.$.style.left = 0;
                                editorContent.style.height = (editor.container.$.offsetHeight -90) + 'px';
                            } else {
                                if(parentElem.length > 0) parentElem[0].style.transform='translate(0px, 0px)';
                                editor.container.removeClass('cke_maximized');
                                editor.container.$.style.position = originalPosition;
                                editor.container.$.style.width=originalWidth;
                                editor.container.$.style.height=originalHeight;
                                editor.container.$.style.top = 'unset';
                                editor.container.$.style.left = 'unset';
                                editor.container.$.style.left = 'unset';
                                editorContent.style.height = originalContentHeight;
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
            />
        </div>
    );
};

export default CKEditor4Wrapper;