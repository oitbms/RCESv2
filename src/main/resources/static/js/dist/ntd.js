var b=(m,t)=>()=>(t||m((t={exports:{}}).exports,t),t.exports);var k=b(g=>{var p=g&&g.__awaiter||function(m,t,d,e){function i(a){return a instanceof d?a:new d(function(o){o(a)})}return new(d||(d=Promise))(function(a,o){function s(h){try{l(e.next(h))}catch(c){o(c)}}function f(h){try{l(e.throw(h))}catch(c){o(c)}}function l(h){h.done?a(h.value):i(h.value).then(s,f)}l((e=e.apply(m,t||[])).next())})},v=class extends Base{constructor(t=1/0,d=1/0){super($(".table-body"),t,d,()=>{this.displayPage("/api/ntd/get-page-ntd",void 0).catch(console.error)}),this.createNtd=e=>p(this,void 0,void 0,function*(){yield this.handleCreateForm(e,"/api/ntd/create-ntd","create-dialog",i=>({name:i.find('input[name="name"]').val(),type:i.find('textarea[name="type"]').val(),dateVerification:i.find('input[name="dateVerification"]').val(),comment:i.find('textarea[name="comment"]').val()}),i=>{let a=this.createRow(i);$(".table-body").append(a)})}),this.selectRow=e=>p(this,void 0,void 0,function*(){this.toggleRowSelection(e,!0);let a=$(e.currentTarget).closest(".table-row"),o=a.attr("id");this.selectedRows.has(o)&&this.editMode?this.enableEditMode(["dateVerification"],a,[{name:"document",transform:s=>s},{name:"references",transform:s=>s}]):this.selectedRows.has(o)||this.disableEditMode(["dateVerification"],["document","references"],a,["dateVerification","type"])}),this.openDocument=e=>p(this,void 0,void 0,function*(){let a=$(e.currentTarget).closest(".table-row").attr("id"),o=this.localCache.get(a);yield this.openDocumentDialog(e,o.documentId,`/api/document/get-document/${o.documentId}`,o.documentId?"/api/document/add-file-to-document":`/api/ntd/create-document/${o.id}`,"/api/document/delete-file-from-document",f=>{this.createNotification("\u0424\u0430\u0439\u043B\u044B \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B",NotificationType.SUCCESS)}),$("#documentDialog").off("change","#reloadFileInput").on("change","#reloadFileInput",f=>{let l=f.currentTarget;if(!l.files||l.files.length===0)return;let h=l.files[0],c=$(l).closest(".dialog-content-rows-row").attr("id"),r=this.lockScreen();this.deleteEntity(`/api/document/delete-file-from-document/${c}`).then(()=>{let n=new FormData;return n.append("file",h),this.requestToApi(`/api/document/add-file-2-document/${o.documentId}`,"PATCH",n)}).then(n=>(this.createRowOnDocument(n,c),this.requestToApi(`/api/ntd/calculate-references?id=${a}`,"POST"))).then(()=>{this.createNotification("\u0424\u0430\u0439\u043B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D",NotificationType.SUCCESS),o.references.forEach(n=>{let u=this.localCache.get(n);u.color=Color.RED,this.updateRow(u,n)}),r()}).catch(()=>{this.createNotification("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438",NotificationType.ERROR),r()})})}),this.createRowOnDocument=(e,i)=>{let a=$("#documentDialog").find(".dialog-content-rows"),o=`
                <div class="dialog-content-rows-row" id="${e.id}">
                    <div class="content-row-column col-450">${e.baseFileName}</div>
                    <div class="content-row-column col-100 center">
                        ${e.type}</div>
                    <div class="content-row-column col-100 file-items">
                        <i class="fas fa-arrows-rotate reload-icon tooltip-trigger" data-description="\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044E" data-file-id="${e.id}" onclick="$('#reloadFileInput').click()"></i>
                        <input type="file" id="reloadFileInput" class="reload-file-input" style="display: none;"/>
                        <i style="float: right" class="download fas fa-download tooltip-trigger" data-description="\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044E" data-file-id="${e.id}"></i>
                    </div>
                </div>`;i?a.find(`#${i}`).replaceWith(o):a.append(o)},this.openReferences=e=>p(this,void 0,void 0,function*(){let i=$("#referencesDialog"),o=$(e.currentTarget).closest(".table-row").attr("id"),s=this.localCache.get(o),f=i.find(".dialog-content-rows");i.find(".search-container").length||i.find(".dialog-container-header").append(`
            <div class="search-container" style="margin: 10px 0;">
                <input type="text" id="search-input" class="search-input" placeholder="\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u044E..."
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
        `),f.empty();let l=(c,r)=>{c.forEach(n=>{f.append(`
                    <div class="dialog-content-rows-row" id="${n.id}" data-name="${n.name.toLowerCase()}">
                        <div class="content-row-column" style="width: 500px">${n.name}</div>
                        <div class="content-row-column center" style="width:150px;">${n.type}</div>
                        <div class="content-row-column center" style="width:200px;">${this.formatDate(n.dateVerification)}</div>
                        <div class="content-row-column" style="width: 100px; text-align: center">
                            <div class="frame" style="background-color: ${this.calculateColor(n.color)}">
                                <i class="download-inn fa-solid fa-file tooltip-trigger" data-description="\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442" id="${n.documentId}"></i>
                            </div>
                        </div>
                        <div class="content-row-column" style="width: 500px">${n.comment}</div>
                        <div class="content-row-column center" style="width: 100px">
                            <label class="container-checkbox tooltip-trigger" data-description="${r?"\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044E":"\u0421\u0432\u044F\u0437\u0430\u0442\u044C \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044E"}">
                                <input class="checkbox" ${r?'checked="checked"':""} type="checkbox">
                                <div class="checkmark"></div>
                            </label>
                        </div>
                    </div>`)})};if(s.references.length>0){let c=yield this.requestToApi(`/api/ntd/get-references?ids=${s.references}`,"GET");this.localCache.set("references",c),l(c,!0)}let h=yield this.requestToApi(`/api/ntd/get-all-references?id=${s.id}&ids=${s.references}`,"GET");l(h,!1),i.off("input",".search-input").on("input",".search-input",function(){let c=$(this).val().toString().toLowerCase();$(".dialog-content-rows-row").each(function(){let r=$(this).find(".content-row-column").first().text().toLowerCase();$(this).toggle(r.includes(c))})}),i.off("click",".container-checkbox").on("click",".container-checkbox",c=>p(this,void 0,void 0,function*(){c.preventDefault();let r=$(c.currentTarget),n=r.find('input[type="checkbox"]'),u=r.closest(".dialog-content-rows-row").attr("id"),w=!n.prop("checked");w?(yield this.requestToApi(`/api/ntd/add-reference?id=${s.id}&referenceId=${u}`,"PATCH"),s.references.push(u)):(yield this.requestToApi(`/api/ntd/remove-reference?id=${s.id}&referenceId=${u}`,"PATCH"),s.references=s.references.filter(y=>y!==u)),n.prop("checked",w),r.toggleClass("checked",w)})),i.off("click",".download-inn").on("click",".download-inn",c=>{let n=$(c.currentTarget).attr("id");n?this.downloadFile(`/api/document/download-all-document-file/${n}`).catch(console.error):this.createNotification("\u0424\u0430\u0439\u043B \u043D\u0435 \u043F\u0440\u0438\u043A\u0440\u0435\u043F\u043B\u0435\u043D",NotificationType.INFO)}),this.dialog.open("referencesDialog",{onClose:()=>{$("#referencesDialog .search-input").val("")}})}),this.showRowContextMenu=e=>{this.createRowDeleteContextMenu(e,"/api/ntd/delete","\u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438")},this.createHandler("click",".circle-row",this.selectRow.bind(this),!0),this.createHandler("click","#edit-button",()=>{this.editMode?(this.disableEditMode(["dateVerification"],["document","references"],void 0,["dateVerification","type"]),this.editMode||$("#edit-button").removeClass("active")):(this.enableEditMode(["dateVerification"],void 0,[{name:"document",transform:e=>e},{name:"references",transform:e=>e}]),$("#edit-button").addClass("active"))},!0),this.createHandler("click","#create-button",()=>this.dialog.open("create-dialog"),!0),this.createHandler("click","#save-button",()=>this.saveNtd(),!0),this.bindFieldChanges(),this.createHandler("click",".document",this.openDocument.bind(this),!0),this.createHandler("click",".references",this.openReferences.bind(this),!0),this.createHandler("click",".download",this.handleDownloadFile.bind(this),!0),this.createHandler("click","#createBtn",this.createNtd,!0),this.createHandler("contextmenu",".table-row.selected",this.showRowContextMenu,!0),this.bindSearchInput("#searchInput")}createRow(t){let d=`
            <div class="table-row" id="${t.id}" data-index="${t.id}">
                <div class="table-cell" style="width: var(--name); position: relative">
                    <div class="circle circle-row tooltip-trigger" data-description="\u0412\u044B\u0434\u0435\u043B\u0438\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443"></div>
                    <div class="field-container" data-name="name" contenteditable="false">
                        ${t.name}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--type);">
                    <div class="field-container center" data-name="type" contenteditable="false">
                        ${t.type}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--dateVerification);">
                    <div class="field-container center" data-name="dateVerification" contenteditable="false">
                        ${this.formatDate(t.dateVerification)}
                    </div>
                </div>
                <div class="table-cell" style="width: var(--file); padding: 0">
                    <div data-name="document" contenteditable="false" style="height: 100%; width: 100%">
                        <div class="frame" style="background-color: ${this.calculateColor(t.color)}">
                            <i class="document fa-solid fa-file tooltip-trigger" data-description="\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043E\u043A\u043D\u043E \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430"></i>
                        </div>
                    </div>
                </div>
                <div class="table-cell" style="width: var(--references); padding: 0">
                    <div data-name="references" contenteditable="false">
                        <i class="references fa-solid fa-book tooltip-trigger" data-description="\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043E\u043A\u043D\u043E \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0445 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u043E\u0432"></i>
                    </div>
                </div>
                <div class="table-cell" style="width: var(--comment);">
                    <div class="field-container" data-name="comment" contenteditable="false">
                        ${t.comment}
                    </div>
                </div>
            </div>`;return $(d)}onScroll(){}saveNtd(){if(Object.keys(this.saveMassive).length===0)return;let t=Object.keys(this.saveMassive).map(d=>{let e=this.localCache.get(d);return{id:d,version:e.version,changes:this.saveMassive[d]}});this.save("/api/ntd/update",...t).then(()=>{this.disableEditMode(["dateVerification"],["document","references"]),t.forEach(d=>this.selectedRows.delete(d.toString()))})}handleDownloadFile(t){this.handleDownloadFileFromDialog(t,"/api/document/download-document-file")}applyFilters(){$(".table-row").each(function(){let t=$(this).find('[data-name="name"]').text().toLowerCase(),d=$(this).find('[data-name="type"]').text().toLowerCase(),e=$(this).find('[data-name="comment"]').text().toLowerCase(),i=t.includes(this.searchText)||d.includes(this.searchText)||e.includes(this.searchText);$(this).toggle(i)}.bind(this))}};$(document).ready(()=>{new v})});export default k();
