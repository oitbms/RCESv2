var T=(g,i)=>()=>(i||g((i={exports:{}}).exports,i),i.exports);var x=T(S=>{var b=S&&S.__awaiter||function(g,i,n,t){function e(c){return c instanceof n?c:new n(function(a){a(c)})}return new(n||(n=Promise))(function(c,a){function o(l){try{d(t.next(l))}catch(v){a(v)}}function s(l){try{d(t.throw(l))}catch(v){a(v)}}function d(l){l.done?c(l.value):e(l.value).then(o,s)}d((t=t.apply(g,i||[])).next())})},D=class extends Base{constructor(i=1/0,n=1/0){super($(".inspection-list"),i,n,()=>{this.displayPage("/api/inspection/get-page-inspection",void 0).catch(console.error)}),this.createInspection=t=>b(this,void 0,void 0,function*(){t.preventDefault();let e=$(t.target),c=e.closest("form").get(0),a=$("#create-dialog");if(!c.checkValidity()){c.reportValidity();return}e.prop("disabled",!0);let o={subDivision:a.find('select[name="subDivision"]').val()};try{let s=yield this.createEntity("/api/inspection/create-inspection",o);this.saveMassive={},this.localCache.set(s.id,s),this.dialog.close("create-dialog");let d=this.createRow(s);this.addInspectionToGroup(s),e.prop("disabled",!1),this.createNotification("\u0418\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D\u0430",NotificationType.SUCCESS)}catch{this.saveMassive={},c.reset(),e.prop("disabled",!1)}}),this.viewInspection=t=>b(this,void 0,void 0,function*(){t.preventDefault();let e=$("#viewInspectionDialog"),a=$(t.currentTarget).closest(".table-card").attr("id"),o=this.localCache.get(Number(a));(!o.violation||o.violation.length===0)&&(o.violation=yield this.requestToApi(`/api/inspection/get-violation/${a}`,"GET"),this.localCache.set(Number(a),o));let s=e.find(".violations-container");s.empty(),e.find("#closeBtn").off("click").on("click",()=>{this.dialog.close("viewInspectionDialog")}),e.find("#addViolationBtn").off("click").on("click",()=>{this.openAddViolationDialog(a)}),!o.violation||o.violation.length===0?s.append(`
                <div class="no-violations">
                    \u041D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E
                </div>
            `):o.violation.forEach(d=>{var l,v;let p=5;switch(d.criteria){case"\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430":p=3;break;case"\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u043C\u0435\u0441\u0442":p=2;break;case"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F":p=3;break;case"\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0430":p=5;break}let r=`
                    <div class="violation-card" id="${a}" data-violation-id="${d.id}">
                        <div class="violation-card-header">
                            <div class="score">${d.score}/${p}</div>
                            <div class="criteria">${d.criteria}</div>
                        </div>
                        <div class="violation-card-body">
                            <div class="field-row">
                                <div class="label">\u041E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439:</div>
                                <div class="value">${(l=d.subDivision)===null||l===void 0?void 0:l.name}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">\u0414\u0430\u0442\u0430 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0438\u044F:</div>
                                <div class="value">${this.formatDateTime(d.createdDate)}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">\u0421\u0442\u0430\u0442\u0443\u0441:</div>
                                <div class="value" name="status">${d.status}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:</div>
                                <div class="value">${d.description}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">\u0421\u043E\u0437\u0434\u0430\u043B:</div>
                                <div class="value">${(v=d.createdBy)===null||v===void 0?void 0:v.name}</div>
                            </div>
                            <div class="field-row">
                                <div class="label">\u0424\u043E\u0442\u043E:</div>
                                <button class="dialog-btn print photo-icon">\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440</button>
                            </div>
                        </div>
                        <div class="violation-card-footer">
                            <button class="btn btn-delete" data-violation-id="${d.id}">
                                \u0423\u0434\u0430\u043B\u0438\u0442\u044C
                            </button>
                            <button class="btn btn-fixed" data-violation-id="${d.id}">
                                \u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043A\u0430\u043A \u0438\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u043E\u0435
                            </button>
                        </div>
                    </div>
                `;s.append(r)}),e.off("click",".btn-delete").on("click",".btn-delete",d=>{let l=$(d.currentTarget);if(o.haveSecondInspection){this.createNotification("\u041D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0435 \u0443 \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u0438, \u0435\u0441\u043B\u0438 \u0435\u0441\u0442\u044C \u0432\u0442\u043E\u0440\u0438\u0447\u043D\u0430\u044F \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F",NotificationType.WARNING);return}let v=l.attr("data-violation-id");this.createConfirmationDialog("\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u044F").then(p=>{p&&this.deleteEntity(`/api/inspection/delete-violation/${v}`).then(()=>{l.closest(".violation-card").remove(),o.violation=o.violation.filter(r=>r.id!==v),this.localCache.set(o.id,o),(!o.violation||o.violation.length===0)&&s.append(`
                                <div class="no-violations">
                                    \u041D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E
                                </div>
                            `),this.createNotification("\u041D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u043E",NotificationType.SUCCESS)})})}),e.off("click",".btn-fixed").on("click",".btn-fixed",d=>{let l=$(d.currentTarget);if(o.haveSecondInspection){this.createNotification("\u0423 \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u0438 \u0435\u0441\u0442\u044C \u0432\u0442\u043E\u0440\u0438\u0447\u043D\u0430\u044F \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F",NotificationType.WARNING);return}let v=l.attr("data-violation-id"),p=o.violation.find(r=>r.id===v);this.requestToApi(`/api/inspection/change-status-violation/${v}`,"PATCH").then(()=>{p.status=p.status==="\u041D\u0435 \u0438\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E"?"\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E":"\u041D\u0435 \u0438\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E",o.violation=o.violation.map(r=>r.id===v?p:r),this.localCache.set(o.id,o),l.closest(".violation-card").find('[name="status"]').text(p.status),this.createNotification("\u0421\u0442\u0430\u0442\u0443\u0441 \u0438\u0437\u043C\u0435\u043D\u0435\u043D",NotificationType.SUCCESS)})}),e.off("click",".photo-icon").on("click",".photo-icon",this.openImagesDialog.bind(this)),this.dialog.open("viewInspectionDialog")}),this.openImagesDialog=t=>b(this,void 0,void 0,function*(){t.preventDefault();let c=$(t.currentTarget).closest(".violation-card").data("violation-id"),a=this.lockScreen();try{let o=yield this.requestToApi(`/api/inspection/get-images-inspection/${c}`,"GET");if(!o||o.length===0){this.createNotification("\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438 \u043D\u0435 \u043F\u0440\u0438\u043A\u0440\u0435\u043F\u043B\u0435\u043D\u044B",NotificationType.INFO);return}let s=$("#photosDialog"),d=s.find(".photos-gallery");d.empty(),o.forEach((l,v)=>{d.append(`
                    <div class="photo-item ${v===0?"active":""}">
                        <img src="${l.data}" id="${l.id}" 
                             alt="${l.name||"\u0424\u043E\u0442\u043E \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u044F"} ${v+1}"
                             loading="lazy">
                    </div>
                `)}),s.find(".current-photo").text("1"),s.find(".total-photos").text(o.length),this.setupPhotoNavigation(s,o.length),this.dialog.open("photosDialog")}catch{this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0439",NotificationType.ERROR)}finally{a()}}),this.createHandler("click","#create-button",()=>this.dialog.open("create-dialog"),!0),this.createHandler("click","#createBtn",this.createInspection.bind(this),!0),this.createHandler("click","#createSecondaryBtn",this.createSecondaryInspection.bind(this),!0),this.createHandler("click",".view-btn",this.viewInspection.bind(this),!0),this.createHandler("click","#createViolation",this.createViolation.bind(this),!0),this.createHandler("click",".modal-input-change",this.changeSubDivision.bind(this),!0),this.createHandler("click",".delete-inspection",t=>{let e=$(t.target).closest(".table-card").attr("id"),c=this.localCache.get(Number(e));if(c.haveSecondInspection){this.createNotification("\u041D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044E \u0441 \u0432\u0442\u043E\u0440\u0438\u0447\u043D\u043E\u0439 \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u0435\u0438\u0306",NotificationType.WARNING);return}this.createConfirmationDialog("\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u0438").then(a=>{a&&this.deleteEntity(`/api/inspection/delete-inspection/${e}`).then(()=>{if(this.deleteRow(e),this.createNotification("\u0418\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u0430",NotificationType.SUCCESS),c.primaryInspectionId!=null){let o=this.localCache.get(c.primaryInspectionId);o.haveSecondInspection=!1}})})}),this.createHandler("click","#report-btn",this.makeReport.bind(this),!0),this.createHandler("click","#print-button",t=>this.print(t),!0)}createRow(i){var n;let t=`
            <div class="table-card" id="${i.id}" data-index="${i.id}">
               <div class="card-body">
                   <div class="card-title">
                       <h5>\u0418\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F \u2116${i.id}</h5>
                   </div>
                       <p class="card-text">
                           \u0414\u0430\u0442\u0430: ${this.formatDateTime(i.dateInspection)}<br>
                           \u0422\u0438\u043F: ${i.type}<br>
                           \u0426\u0435\u0445: <span data-inspection-id="${i.id}">${(n=i.subDivision)===null||n===void 0?void 0:n.name}</span>
                           ${i.primaryInspectionId!=null?`<br> \u041F\u0435\u0440\u0432\u0438\u0447\u043D\u0430\u044F \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F: <span data-inspection-id="${i.primaryInspectionId}">\u2116${i.primaryInspectionId}</span>`:""}       
                       </p>
                   <div class="buttons">
                       <button class="btn btn-outline-primary view-btn">\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</button>
                       ${i.primaryInspectionId!=null?"":'<button class="btn btn-warning" id="createSecondaryBtn">\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u0443\u044E \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443</button>'}
                       <button class="btn btn-success" data-inspectionId="${i.id}" id="report-btn">\u041E\u0442\u0447\u0435\u0442\u044B</button>
                       <button class="btn btn-danger delete-inspection">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>
                   </div>
               </div>     
            </div>`;return $(t)}onScroll(){}createSecondaryInspection(i){return b(this,void 0,void 0,function*(){let n=$(i.target).closest(".table-card").attr("id"),t=this.localCache.get(Number(n));try{let e=yield this.createEntity(`/api/inspection/create-secondary-inspection/${n}`);this.localCache.set(e.id,e);let c=this.createRow(e);this.addInspectionToGroup(e),t.haveSecondInspection=!0,this.localCache.set(t.id,t),this.createNotification("\u0412\u0442\u043E\u0440\u0438\u0447\u043D\u0430\u044F \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D\u0430",NotificationType.SUCCESS)}catch{this.createNotification("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u0432\u0442\u043E\u0440\u0438\u0447\u043D\u043E\u0439 \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u0438",NotificationType.ERROR)}})}openAddViolationDialog(i){let n=$("#addViolationDialog"),t=n.find("#addViolationForm")[0];n.data("inspection-id",i),t.reset();let e=n.find("#criteriaSelect"),c=n.find("#scoreSelect"),a=o=>{c.empty();for(let s=1;s<=o;s++){let d=$("<option>",{value:s,text:this.getScoreText(s)});s===1&&d.prop("selected",!0),c.append(d)}};a(5),e.off("change").on("change",function(){let o=$(this).val(),s=5;switch(o){case"\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430":s=3;break;case"\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u043C\u0435\u0441\u0442":s=2;break;case"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F":s=3;break;case"\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0430":s=5;break;default:s=5;break}a(s)}),n.find("#cancelAddBtn").off("click").on("click",()=>{this.dialog.close("addViolationDialog")}),this.dialog.open("addViolationDialog")}getScoreText(i){let n=i%10,t=i%100;return t>=11&&t<=14?`${i} \u0431\u0430\u043B\u043B\u043E\u0432`:n===1?`${i} \u0431\u0430\u043B\u043B`:n>=2&&n<=4?`${i} \u0431\u0430\u043B\u043B\u0430`:`${i} \u0431\u0430\u043B\u043B\u043E\u0432`}createViolation(i){return b(this,void 0,void 0,function*(){var n,t;i.preventDefault();let e=$(i.target),c=e.closest("form").get(0),a=$("#addViolationDialog"),o=a.data("inspection-id");if(!c.checkValidity()){c.reportValidity();return}if(this.localCache.get(Number(o)).haveSecondInspection){this.createNotification("\u0423 \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u0438 \u0435\u0441\u0442\u044C \u0432\u0442\u043E\u0440\u0438\u0447\u043D\u0430\u044F \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F",NotificationType.WARNING);return}e.prop("disabled",!0);let d=new FormData,l={inspectionId:o,description:a.find('textarea[name="description"]').val(),criteria:a.find('select[name="criteria"]').val(),score:a.find('select[name="score"]').val(),subDivision:a.find('input[name="subDivision"]').val()},v=new Blob([JSON.stringify(l)],{type:"application/json"});d.append("data",v,"data.json");let p=a.find('input[name="additionalFiles"]')[0];if(p?.files)for(let r=0;r<p.files.length;r++)d.append("additionalFiles",p.files[r]);try{let r=yield this.createEntity("/api/inspection/create-violation",d);this.saveMassive={};let h=this.localCache.get(r.inspectionId);h.violation.push(r),this.localCache.set(h.id,h),this.dialog.close("addViolationDialog");let m=$("#viewInspectionDialog").find(".violations-container");m.find(".no-violations").remove();let y=`
                <div class="violation-card" id="${h.id}" data-violation-id="${r.id}">
                    <div class="violation-card-header">
                        <div class="score">${r.score}/5</div>
                        <div class="criteria">${r.criteria}</div>
                    </div>
                    <div class="violation-card-body">
                        <div class="field-row">
                            <div class="label">\u041E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439:</div>
                            <div class="value">${(n=r.subDivision)===null||n===void 0?void 0:n.name}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">\u0414\u0430\u0442\u0430 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0438\u044F:</div>
                            <div class="value">${this.formatDateTime(r.createdDate)}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">\u0421\u0442\u0430\u0442\u0443\u0441:</div>
                            <div class="value">${r.status}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:</div>
                            <div class="value">${r.description}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">\u0421\u043E\u0437\u0434\u0430\u043B:</div>
                            <div class="value">${(t=r.createdBy)===null||t===void 0?void 0:t.name}</div>
                        </div>
                        <div class="field-row">
                            <div class="label">\u0424\u043E\u0442\u043E:</div>
                            <button class="dialog-btn print photo-icon">\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440</button>
                        </div>
                    </div>
                    <div class="violation-card-footer">
                        <button class="btn btn-delete" data-violation-id="${r.id}">
                            \u0423\u0434\u0430\u043B\u0438\u0442\u044C
                        </button>
                        <button class="btn btn-fixed" data-violation-id="${r.id}">
                            \u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043A\u0430\u043A \u0438\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u043E\u0435
                        </button>
                    </div>
                </div>
                `;m.append(y),e.prop("disabled",!1),this.createNotification("\u041D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D\u043E",NotificationType.SUCCESS)}catch{this.saveMassive={},c.reset(),e.prop("disabled",!1)}})}changeSubDivision(i){return b(this,void 0,void 0,function*(){var n;i.preventDefault();let t=$(i.currentTarget),e=t.closest("#addViolationDialog").data("inspection-id"),c=e?this.localCache.get(Number(e)):null,a=(n=c?.subDivision)===null||n===void 0?void 0:n.name,o=["\u041E\u0413\u0422","\u041E\u0413\u041C","\u041E\u0422\u0438\u0422\u0411","\u041F\u0414\u041E"],s=d=>{let l=d.filter(r=>a&&r.name===a?!0:o.some(h=>r.name.includes(h))),v=[],p=new Set;for(let r of l)p.has(r.name)||(p.add(r.name),v.push(r));return v};yield this.openSelectionDialog("subDivision","subDivisionDialog",t,e,s)})}setupPhotoNavigation(i,n){let t=i.find(".photos-gallery"),e=i.find("#prevPhotoBtn"),c=i.find("#nextPhotoBtn"),a=i.find(".current-photo"),o=0,s=()=>{t.find(".photo-item").removeClass("active").hide(),t.find(`.photo-item:eq(${o})`).addClass("active").show(),a.text(o+1),e.prop("disabled",o===0),c.prop("disabled",o===n-1)};e.off("click").on("click",()=>{o>0&&(o--,s())}),c.off("click").on("click",()=>{o<n-1&&(o++,s())}),i.find("#closePhotosBtn").off("click").on("click",()=>{this.dialog.close("photosDialog")}),s(),i.off("dialog:open").on("dialog:open",()=>{i.find("#closePhotosBtn").focus()})}makeReport(i){return b(this,void 0,void 0,function*(){i.preventDefault();let n=$(i.target).closest(".table-card").attr("id"),t=this.localCache.get(Number(n));if((!t.violation||t.violation.length===0)&&(t.violation=yield this.requestToApi(`/api/inspection/get-violation/${n}`,"GET"),this.localCache.set(Number(n),t),!t.violation||t.violation.length===0)){this.createNotification("\u041D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",NotificationType.INFO);return}let e=$("#reportDialog"),c=`
        <div class="report-tabs">
            <button class="report-tab active" data-tab="workshop">\u041E\u0442\u0447\u0435\u0442 \u043F\u043E \u0446\u0435\u0445\u0443</button>
            <button class="report-tab" data-tab="special">\u041E\u0442\u0447\u0435\u0442 \u043F\u043E \u0441\u043B\u0443\u0436\u0431\u0430\u043C</button>
        </div>
    `;e.find(".report-tabs").length||e.find(".dialog-container-header").append(c);let a=`
        <div class="report-tab-content active" id="workshopReport">
            <div class="dialog-content-header">
                <div class="dialog-content-header-column">\u0426\u0435\u0445/\u041F\u043E\u0434\u0440\u0430\u0437\u0434\u0435\u043B\u0435\u043D\u0438\u0435</div>
                <div class="dialog-content-header-column">\u041A\u0440\u0438\u0442\u0435\u0440\u0438\u0439</div>
                <div class="dialog-content-header-column">\u0421\u0443\u043C\u043C\u0430 \u0431\u0430\u043B\u043B\u043E\u0432</div>
            </div>
            <div class="dialog-content-rows workshop-rows"></div>
        </div>
        <div class="report-tab-content" id="specialReport">
            <div class="dialog-content-header">
                <div class="dialog-content-header-column">\u0426\u0435\u0445/\u041F\u043E\u0434\u0440\u0430\u0437\u0434\u0435\u043B\u0435\u043D\u0438\u0435</div>
                <div class="dialog-content-header-column">\u041A\u0440\u0438\u0442\u0435\u0440\u0438\u0439</div>
                <div class="dialog-content-header-column">\u0421\u0443\u043C\u043C\u0430 \u0431\u0430\u043B\u043B\u043E\u0432</div>
            </div>
            <div class="dialog-content-rows special-rows"></div>
        </div>
    `;e.find(".report-tab-content").length||e.find(".dialog-container-content").html(a),$("#print-button").data("inspectionId",t.id),yield this.fillWorkshopReport(t),yield this.fillSpecialReport(),e.find(".report-tab").off("click").on("click",function(){var o;let s=$(this).data("tab");if(e.find(".report-tab").removeClass("active"),$(this).addClass("active"),e.find(".report-tab-content").removeClass("active"),e.find(`#${s}Report`).addClass("active"),s==="workshop"){let d=new Date(t.dateInspection),v=["\u044F\u043D\u0432\u0430\u0440\u044C","\u0444\u0435\u0432\u0440\u0430\u043B\u044C","\u043C\u0430\u0440\u0442","\u0430\u043F\u0440\u0435\u043B\u044C","\u043C\u0430\u0439","\u0438\u044E\u043D\u044C","\u0438\u044E\u043B\u044C","\u0430\u0432\u0433\u0443\u0441\u0442","\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044C","\u043E\u043A\u0442\u044F\u0431\u0440\u044C","\u043D\u043E\u044F\u0431\u0440\u044C","\u0434\u0435\u043A\u0430\u0431\u0440\u044C"][d.getMonth()],p=d.getFullYear();$("#reportDialog .dialog-name").text(`\u041E\u0442\u0447\u0435\u0442 \u043F\u043E \u0446\u0435\u0445\u0443 "${(o=t.subDivision)===null||o===void 0?void 0:o.name}" \u0437\u0430 ${v} ${p} \u0433\u043E\u0434\u0430`)}else $("#reportDialog .dialog-name").text("\u041E\u0442\u0447\u0435\u0442 \u043F\u043E \u041F\u0414\u041E/\u041E\u0413\u041C/\u041E\u0422\u0438\u0422\u0411/\u041E\u0413\u0422 \u0437\u0430 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043C\u0435\u0441\u044F\u0446")}),e.find(".dialog-btn.close").off("click").on("click",()=>{this.dialog.close("reportDialog")}),this.dialog.open("reportDialog")})}fillWorkshopReport(i){return b(this,void 0,void 0,function*(){var n,t,e,c,a,o,s;let d=$("#reportDialog .workshop-rows");d.empty();let l={};i.violation.forEach(u=>{if(u.subDivision&&u.subDivision.name===i.subDivision.name){let f=u.criteria;l[f]||(l[f]={subDivisionName:i.subDivision.name,totalScore:0,description:f}),l[f].totalScore+=u.score}});let v=0;for(let u in l)if(l.hasOwnProperty(u)){let f=l[u],w=`
                    <div class="report-row" data-index="${v}">
                        <div class="report-column">${f.subDivisionName}</div>
                        <div class="report-column">${f.description}</div>
                        <div class="report-column score-column">${f.totalScore}</div>
                    </div>
                `;d.append(w),v++}v===0&&d.append(`
                <div class="no-data">
                    \u041D\u0435\u0442 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u043F\u043E\u0434\u0440\u0430\u0437\u0434\u0435\u043B\u0435\u043D\u0438\u044F "${i.subDivision.name}"
                </div>
            `),d.append('<div class="report-divider"></div>');let p=5,r=0,h=[],m=((n=i.subDivision)===null||n===void 0?void 0:n.name)||"";if(["\u041F\u0414\u041E","\u041E\u0413\u041C","\u041E\u0422\u0438\u0422\u0411"].some(u=>m.toUpperCase().indexOf(u)!==-1)){let u=((t=l["\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0430"])===null||t===void 0?void 0:t.totalScore)||0,f=((e=l.\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F)===null||e===void 0?void 0:e.totalScore)||0;u>=6&&(r+=2.5,h.push("\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0430: -2.5%")),f>=6&&(r+=2.5,h.push("\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F: -2.5%"))}else{let u=((c=l["\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0430"])===null||c===void 0?void 0:c.totalScore)||0,f=((a=l["\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430"])===null||a===void 0?void 0:a.totalScore)||0,w=((o=l["\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u043C\u0435\u0441\u0442"])===null||o===void 0?void 0:o.totalScore)||0,k=((s=l.\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F)===null||s===void 0?void 0:s.totalScore)||0;u>=9&&(r+=1.25,h.push("\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0430: -1.25%")),f>=9&&(r+=1.25,h.push("\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430: -1.25%")),w>=9&&(r+=1.25,h.push("\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u043C\u0435\u0441\u0442: -1.25%")),k>=9&&(r+=1.25,h.push("\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F: -1.25%"))}let N=Math.max(0,p-r),I="";h.length>0&&h.forEach(u=>{I+=`
                    <div class="penalty-row">
                        <span class="penalty-label">${u}</span>
                    </div>
                `});let C=`
            <div class="bonus-calculation">
                <h4>\u0420\u0430\u0441\u0447\u0435\u0442 \u043F\u0440\u0435\u043C\u0438\u0438 \u0434\u043B\u044F ${i.subDivision.name}</h4>
                <div class="bonus-row">
                    <span class="bonus-label">\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u043F\u0440\u0435\u043C\u0438\u044F:</span>
                    <span class="bonus-value">${p.toFixed(2)} %</span>
                </div>
                ${h.length>0?`
                    <div class="bonus-section">
                        <div class="bonus-section-title">\u041F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u043D\u044B\u0435 \u0448\u0442\u0440\u0430\u0444\u044B:</div>
                        ${I}
                    </div>
                `:`
                    <div class="bonus-row">
                        <span class="bonus-label">\u0428\u0442\u0440\u0430\u0444\u044B \u043D\u0435 \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u044B</span>
                        <span class="bonus-value">-</span>
                    </div>
                `}
                <div class="bonus-row final-bonus">
                    <span class="bonus-label">\u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u0435\u043C\u0438\u044F:</span>
                    <span class="bonus-value">${N.toFixed(2)} %</span>
                </div>
            </div>
        `;d.append(C)})}fillSpecialReport(){return b(this,void 0,void 0,function*(){let i=$("#reportDialog .special-rows");i.empty();try{let n=yield this.requestToApi("/api/inspection/get-all-services-violation","GET");if(n.length===0){i.append(`
                    <div class="no-data">
                        \u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043E \u0438\u043D\u0441\u043F\u0435\u043A\u0446\u0438\u044F\u043C
                    </div>
                `);return}let t={},e=["\u041F\u0414\u041E","\u041E\u0413\u041C","\u041E\u0422\u0438\u0422\u0411","\u041E\u0413\u0422"];for(let a of n){if(!a||!a.subDivision||!a.criteria)continue;let o=a.subDivision.name,s=a.criteria;e.some(l=>o&&o.toUpperCase()===l.toUpperCase())&&(t[o]||(t[o]={}),t[o][s]||(t[o][s]=0),t[o][s]+=a.score||0)}if(Object.keys(t).length===0){i.append(`
                    <div class="no-data">
                        \u041D\u0435\u0442 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0439 \u043F\u043E \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u043C \u043F\u043E\u0434\u0440\u0430\u0437\u0434\u0435\u043B\u0435\u043D\u0438\u044F\u043C (\u041F\u0414\u041E/\u041E\u0413\u041C/\u041E\u0422\u0438\u0422\u0411/\u041E\u0413\u0422)
                    </div>
                `);return}let c=0;for(let a in t)if(t.hasOwnProperty(a)){let o=t[a];i.append(`
                        <div class="subdivision-header" data-subdivision="${a}">
                            <strong>${a}</strong>
                        </div>
                    `);for(let s in o)if(o.hasOwnProperty(s)){let d=o[s],l=`
                                <div class="report-row" data-index="${c}">
                                    <div class="report-column">${a}</div>
                                    <div class="report-column">${s}</div>
                                    <div class="report-column score-column">${d}</div>
                                </div>
                            `;i.append(l),c++}i.append('<div class="subdivision-divider"></div>')}i.find(".subdivision-divider").last().remove(),i.append('<div class="report-divider"></div>');for(let a in t)if(t.hasOwnProperty(a)){let o=t[a],s=5,d=0,l=[],v=o["\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0430"]||0,p=o.\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F||0;v>=6&&(d+=2.5,l.push("\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0442\u0440\u0443\u0434\u0430: -2.5%")),p>=6&&(d+=2.5,l.push("\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F: -2.5%"));let r=Math.max(0,s-d),h="";l.length>0&&l.forEach(y=>{h+=`
                            <div class="penalty-row">
                                <span class="penalty-label">${y}</span>
                            </div>
                        `});let m=`
                        <div class="bonus-calculation">
                            <h4>\u0420\u0430\u0441\u0447\u0435\u0442 \u043F\u0440\u0435\u043C\u0438\u0438 \u0434\u043B\u044F ${a}</h4>
                            <div class="bonus-row">
                                <span class="bonus-label">\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u043F\u0440\u0435\u043C\u0438\u044F:</span>
                                <span class="bonus-value">${s.toFixed(2)} %</span>
                            </div>
                            ${l.length>0?`
                                <div class="bonus-section">
                                    <div class="bonus-section-title">\u041F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u043D\u044B\u0435 \u0448\u0442\u0440\u0430\u0444\u044B:</div>
                                    ${h}
                                </div>
                            `:`
                                <div class="bonus-row">
                                    <span class="bonus-label">\u0428\u0442\u0440\u0430\u0444\u044B \u043D\u0435 \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u044B</span>
                                    <span class="bonus-value">-</span>
                                </div>
                            `}
                            <div class="bonus-row final-bonus">
                                <span class="bonus-label">\u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u0435\u043C\u0438\u044F:</span>
                                <span class="bonus-value">${r.toFixed(2)} %</span>
                            </div>
                        </div>
                        <div style="height: 20px;"></div>
                    `;i.append(m)}}catch(n){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043E\u0442\u0447\u0435\u0442\u0430:",n),i.append(`
                <div class="no-data error">
                    \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0434\u0430\u043D\u043D\u044B\u0445: ${n.message||"\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430"}
                </div>
            `)}})}print(i){let n=Object.create(null,{print:{get:()=>super.print}});return b(this,void 0,void 0,function*(){let t=$(i.currentTarget).data("inspectionId");this.reports=[{name:"\u041E\u0442\u0447\u0435\u0442 \u043F\u043E \u0443\u0447\u0430\u0441\u0442\u043A\u0443",api:"/api/report/print/inspection-workshop",params:{id:t}},{name:"\u041E\u0442\u0447\u0435\u0442 \u043F\u043E \u0441\u043B\u0443\u0436\u0431\u0430\u043C",api:"/api/report/print/inspection-services",params:{}}],yield n.print.call(this,i)})}displayPage(i,n,...t){return b(this,void 0,void 0,function*(){let e=yield this.requestToApi(i,"GET",n);this.renderInspections(e.data),t.forEach(c=>c?.(e.data,e.count))})}groupByMonth(i){let n={};return i.forEach(t=>{let c=new Date(t.dateInspection).toLocaleString("ru-RU",{month:"long",year:"numeric"}),a=c.charAt(0).toUpperCase()+c.slice(1);n[a]||(n[a]=[]),n[a].push(t)}),n}parseMonthString(i){let[n,t]=i.split(" "),e=this.getMonthIndex(n);return new Date(parseInt(t),e,1)}getMonthIndex(i){return["\u044F\u043D\u0432\u0430\u0440\u044C","\u0444\u0435\u0432\u0440\u0430\u043B\u044C","\u043C\u0430\u0440\u0442","\u0430\u043F\u0440\u0435\u043B\u044C","\u043C\u0430\u0439","\u0438\u044E\u043D\u044C","\u0438\u044E\u043B\u044C","\u0430\u0432\u0433\u0443\u0441\u0442","\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044C","\u043E\u043A\u0442\u044F\u0431\u0440\u044C","\u043D\u043E\u044F\u0431\u0440\u044C","\u0434\u0435\u043A\u0430\u0431\u0440\u044C"].findIndex(t=>t.toLowerCase()===i.toLowerCase())}renderInspections(i){let n=this.groupByMonth(i),t=this.rowContainer;t.empty();let e=Object.keys(n).sort((c,a)=>this.parseMonthString(c).getTime()-this.parseMonthString(a).getTime());for(let c of e){let a=n[c],o=$(`
                <div class="month-section" data-month="${c}">
                    <div class="month-header">
                        <span class="month-name">${c}</span>
                        <span class="month-toggle">\u25BC</span>
                    </div>
                    <div class="month-cards"></div>
                </div>
            `),s=o.find(".month-cards");a.forEach(d=>{let l=this.createRow(d);s.append(l),this.localCache.set(d.id,d)}),s.hide(),o.find(".month-header").on("click",()=>{s.slideToggle(200),o.find(".month-toggle").text(s.is(":visible")?"\u25BC":"\u25B6")}),t.append(o)}}insertMonthSection(i){let n=this.rowContainer,t=i.data("month"),e=this.parseMonthString(t),c=!1;n.children(".month-section").each((a,o)=>{let s=$(o),d=this.parseMonthString(s.data("month"));if(e<d)return i.insertBefore(s),c=!0,!1}),c||n.append(i),i.find(".month-header").on("click",()=>{let a=i.find(".month-cards");a.slideToggle(200),i.find(".month-toggle").text(a.is(":visible")?"\u25BC":"\u25B6")})}addInspectionToGroup(i){let t=new Date(i.dateInspection).toLocaleString("ru-RU",{month:"long",year:"numeric"}),e=t.charAt(0).toUpperCase()+t.slice(1),c=$(`.month-section[data-month="${e}"]`);c.length===0&&(c=$(`
                <div class="month-section" data-month="${e}">
                    <div class="month-header">
                        <span class="month-name">${e}</span>
                        <span class="month-toggle">\u25BC</span>
                    </div>
                    <div class="month-cards"></div>
                </div>
            `),this.insertMonthSection(c));let a=c.find(".month-cards"),o=this.createRow(i);a.append(o),this.localCache.set(i.id,i)}deleteRow(i){return new Promise(n=>{let t=$(`#${i}`),e=t.closest(".month-section");t.fadeOut(300,()=>{t.remove(),this.localCache.delete(i),e.find(".table-card").length===0&&e.remove(),n()})})}};$(document).ready(()=>{new D})});export default x();
