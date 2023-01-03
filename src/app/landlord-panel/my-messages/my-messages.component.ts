import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.css']
})
export class MyMessagesComponent implements OnInit {
    messagesList: any = []
    fromName: any
    chatLogList: any = []
    dataStatus = 'fetching'
    chatLogStatus = 'fetching'
    modalRef: BsModalRef
    messageForm: FormGroup
    selectedIndex = -1
    loggedInId=true
    toId: any
    selectedId: any
    modalRefConfirm: BsModalRef
    ids: Array<any> = []
    multiIndex: Array<any> = []
    multiIds: Array<any> = []
  constructor(
    public ds: DataService,
    public api: ApiService,
    public ui: UIHelpers,
    private alert: IAlertService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private ms: BsModalService
  ) {
    this.loggedInId = api.user.id
    this.ds.getMessages().subscribe((resp: any) => {
        if (resp.success === true) {
            this.messagesList = resp.data
            console.log(this.messagesList);

            this.dataStatus = 'done'
        }
    })
    this.messageForm = this.fb.group({

        description: new FormControl(null, [Validators.required, Validators.maxLength(1200)]),
    })

   }

  ngOnInit() {
  }
  openMessage(template: TemplateRef<any>) {
    // this.toId = fromId
    // this.fromName = name
    // this.tutorApi.chatDetails(fromId).subscribe((resp: any) => {
    //     if (resp.success === true) {
    //         this.chatLogList = resp.data
    //         this.chatLogStatus = 'done'
    //     }
    // })

    this.modalRef = this.modalService.show(
        template,
        {
            class: 'modal-lg modal-dialog-centered website',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        }
    )
}
sendMessage(data: any, f: any): boolean {
    if (data.status === 'INVALID') {
        this.alert.error('All fields are required')

        return false
    }
    data.value.to_id = this.toId
    this.ds.sendMessage(data.value).subscribe((resp: any) => {
        if (resp.success === false) {
            this.alert.error(resp.errors.general)
        } else {
            this.alert.success('Sent successfully')
            f.resetForm()
            this.modalRef.hide()
            this.ids = []
        }
    })
}
get g() {
    return this.messageForm.controls
}

cancel(f: any) {
    // this.ids = []
    f.resetForm()
    this.modalRef.hide()
}

}
