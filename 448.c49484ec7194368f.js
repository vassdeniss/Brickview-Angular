"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[448],{448:(E,d,i)=>{i.r(d),i.d(d,{UserModule:()=>A});var p=i(6814),a=i(3065),m=i(4202),e=i(4946);function f(t,o){if(1&t&&e._UZ(0,"img",7),2&t){const n=e.oxw();e.Q6J("src",n.image,e.LSH)}}const h=function(){return["/users","edit"]},P=function(t){return{username:t}};let C=(()=>{class t{constructor(n){this.route=n,this.image=localStorage.getItem("image")}ngOnInit(){this.route.data.subscribe(({user:n})=>this.user=n)}}return t.\u0275fac=function(n){return new(n||t)(e.Y36(a.gz))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-user-current-profile"]],decls:14,vars:8,consts:[[1,"container"],[1,"profile"],["alt","Profile Picture",3,"src",4,"ngIf"],[1,"buttons"],["routerLink","/sets/my-sets",1,"button"],["routerLink","/sets/add-set",1,"button"],[1,"button",3,"routerLink","queryParams"],["alt","Profile Picture",3,"src"]],template:function(n,r){1&n&&(e.TgZ(0,"div",0)(1,"div",1),e.YNc(2,f,1,1,"img",2),e.TgZ(3,"h2"),e._uU(4),e.qZA()(),e.TgZ(5,"h3"),e._uU(6),e.qZA(),e.TgZ(7,"div",3)(8,"button",4),e._uU(9,"My Collection"),e.qZA(),e.TgZ(10,"button",5),e._uU(11,"Add a New Set"),e.qZA(),e.TgZ(12,"button",6),e._uU(13," Edit Profile "),e.qZA()()()),2&n&&(e.xp6(2),e.Q6J("ngIf",r.image),e.xp6(2),e.Oqu(null==r.user?null:r.user.username),e.xp6(2),e.hij("You have: ",null==r.user||null==r.user.sets?null:r.user.sets.length," sets"),e.xp6(6),e.Q6J("routerLink",e.DdM(5,h))("queryParams",e.VKq(6,P,null==r.user?null:r.user.username)))},dependencies:[p.O5,a.rH],styles:["body[_ngcontent-%COMP%]{font-family:Arial,sans-serif;background-color:#f2f2f2;margin:0;padding:0}.container[_ngcontent-%COMP%]{max-width:400px;margin:50px auto;background-color:green;padding:20px;border-radius:5px;color:#fff}.profile[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:20px}.profile[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:60px;height:60px;border-radius:50%;margin-right:10px}.profile[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0}.buttons[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.button[_ngcontent-%COMP%]{padding:8px 12px;background-color:#fff;color:#000;border:none;border-radius:3px;cursor:pointer}@media screen and (max-device-width: 480px) and (orientation: portrait){.container[_ngcontent-%COMP%]{max-width:300px}.buttons[_ngcontent-%COMP%]{flex-direction:column;gap:10px}}"]}),t})();var g=i(3076),s=i(95),_=i(9246),x=i(8394),M=i(2864);function v(t,o){if(1&t&&(e.TgZ(0,"p"),e._uU(1),e.qZA()),2&t){const n=o.$implicit;e.xp6(1),e.Oqu(n)}}function O(t,o){if(1&t){const n=e.EpF();e.TgZ(0,"app-popup",10),e.NdJ("closed",function(){e.CHM(n);const u=e.oxw();return e.KtG(u.popup.hide())}),e.YNc(1,v,2,1,"p",11),e.qZA()}if(2&t){const n=e.oxw();e.xp6(1),e.Q6J("ngForOf",n.errors)}}function Z(t,o){if(1&t&&e._UZ(0,"img",12),2&t){const n=e.oxw();e.Q6J("src",n.currentProfilePicture,e.LSH)}}function y(t,o){1&t&&(e.TgZ(0,"div",13)(1,"label",14),e._uU(2,"Delete Picture?:"),e.qZA(),e._UZ(3,"input",15),e.qZA())}const U=[{path:"my-profile",component:C,canActivate:[m._],resolve:{user:t=>(0,e.f3M)(g.K).user},title:"My Profile"},{path:"edit",component:(()=>{class t{constructor(n,r,u,l,c){this.fb=n,this.popup=r,this.activated=u,this.route=l,this.user=c,this.editForm=this.fb.group({username:["",[s.kI.required,s.kI.minLength(4)]],profilePicture:null,deleteProfilePicture:!1}),this.currentProfilePicture=null,this.errors=[]}ngOnInit(){this.editForm.patchValue({profilePicture:localStorage.getItem("image")}),this.currentProfilePicture=this.editForm.get("profilePicture")?.value,this.activated.queryParams.subscribe(n=>{this.editForm.patchValue({username:n.username})})}onFileChange(n){const r=n.target;if(r.files&&r.files.length>0){const u=r.files[0];this.editForm.patchValue({profilePicture:u});const l=new FileReader;l.readAsDataURL(u),l.onload=()=>{this.currentProfilePicture=l.result,this.editForm.patchValue({profilePicture:l.result})}}}onSubmit(n){if(n.disabled=!0,this.editForm.invalid)return this.errors=[],(0,_.j)(this.editForm).forEach(u=>{this.errors.push(`${u.control} ${u.message}`)}),this.popup.show(),void(n.disabled=!1);this.user.editUser(this.editForm.value).subscribe({complete:()=>{n.disabled=!1,this.editForm.get("deleteProfilePicture")?.value?localStorage.removeItem("image"):localStorage.setItem("image",this.currentProfilePicture),this.route.navigate(["users/my-profile"])},error:r=>{this.errors=[],this.errors.push(r.error.message),this.popup.show(),n.disabled=!1}})}}return t.\u0275fac=function(n){return new(n||t)(e.Y36(s.qu),e.Y36(x.q),e.Y36(a.gz),e.Y36(a.F0),e.Y36(g.K))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-edit-info"]],decls:17,vars:4,consts:[["title","Error!",3,"closed",4,"ngIf"],[1,"edit-form",3,"formGroup","ngSubmit"],[1,"form-group"],["for","username"],["type","text","id","username","name","username","placeholder","Enter new username","formControlName","username"],["for","image"],["type","file","id","image","name","image","accept","image/*",3,"change"],["alt","Selected Image",3,"src",4,"ngIf"],["class","form-group-side",4,"ngIf"],["button",""],["title","Error!",3,"closed"],[4,"ngFor","ngForOf"],["alt","Selected Image",3,"src"],[1,"form-group-side"],["for","deleteProfilePicture"],["type","checkbox","id","deleteProfilePicture","formControlName","deleteProfilePicture"]],template:function(n,r){if(1&n){const u=e.EpF();e.YNc(0,O,2,1,"app-popup",0),e.TgZ(1,"form",1),e.NdJ("ngSubmit",function(){e.CHM(u);const c=e.MAs(15);return e.KtG(r.onSubmit(c))}),e.TgZ(2,"h2"),e._uU(3,"Edit your Information"),e.qZA(),e.TgZ(4,"div",2)(5,"label",3),e._uU(6,"Username"),e.qZA(),e._UZ(7,"input",4),e.qZA(),e.TgZ(8,"div",2)(9,"label",5),e._uU(10,"Profile Image"),e.qZA(),e.TgZ(11,"input",6),e.NdJ("change",function(c){return r.onFileChange(c)}),e.qZA()(),e.YNc(12,Z,1,1,"img",7),e.YNc(13,y,4,0,"div",8),e.TgZ(14,"button",null,9),e._uU(16,"Save Changes"),e.qZA()()}2&n&&(e.Q6J("ngIf",r.popup.isActive),e.xp6(1),e.Q6J("formGroup",r.editForm),e.xp6(11),e.Q6J("ngIf",r.currentProfilePicture),e.xp6(1),e.Q6J("ngIf",r.currentProfilePicture))},dependencies:[p.sg,p.O5,M.R,s._Y,s.Fj,s.Wl,s.JJ,s.JL,s.sg,s.u],styles:["[_nghost-%COMP%]{margin:2rem}.edit-form[_ngcontent-%COMP%]{max-width:400px;margin:0 auto;padding:20px;background-color:#f7f7f7;border:1px solid #ccc;border-radius:4px}.edit-form[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{text-align:center;margin-bottom:20px}.form-group[_ngcontent-%COMP%], .form-group-side[_ngcontent-%COMP%]{margin-bottom:15px}.form-group-side[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px}label[_ngcontent-%COMP%]{display:block;font-weight:700;margin-bottom:12px}input[_ngcontent-%COMP%]{width:95%;padding:10px;border:1px solid #ccc;border-radius:4px}.form-group-side[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{margin:unset}.form-group-side[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:unset}button[_ngcontent-%COMP%]{display:block;width:100%;padding:10px;margin-top:20px;background-color:green;color:#fff;border:none;border-radius:4px;cursor:pointer}button[_ngcontent-%COMP%]:hover{background-color:#015605}img[_ngcontent-%COMP%]{margin:15px 0;width:50%;height:auto;object-fit:cover}"]}),t})(),canActivate:[m._],title:"Edit Profile"}];let F=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[a.Bz.forChild(U),a.Bz]}),t})();var T=i(6208);let A=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[p.ez,F,T.m,s.UX]}),t})()}}]);