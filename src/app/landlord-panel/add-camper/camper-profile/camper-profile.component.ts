import { DataService } from './../data.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper'

@Component({
    selector: 'app-camper-profile',
    templateUrl: './camper-profile.component.html',
    styleUrls: ['./camper-profile.component.css']
})
export class CamperProfileComponent implements OnInit {
    min_booking_period: any
    price_per_night: any
    vehicleId: any = ''
    thumbnail = '/assets/images/default.png'
    uploadedImages = []
    spinnerSVG = '/assets/images/spinner.svg'
    imageChangedEvent: any = ''
    croppedImage: any = ''
    Loading = false
    cropperModalRef: BsModalRef
    constructor(
        public api: ApiService,
        public ds: DataService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.spinnerSVG = `/assets/images/spinner.svg`
        this.vehicleId = this.route.snapshot.paramMap.get('vehId')
        const params = {
            vehicle_id: this.vehicleId
        }

        this.ds.getVehicalImages(params).subscribe(resp => {

            if (resp.data.length > 0) {
                resp.data.forEach((file: any) => {
                    this.uploadedImages.push({
                        id: file.id,
                        vehicle_id: this.vehicleId
                    })
                })
            }
        })
        this.ds.vehicleDetails(this.vehicleId).subscribe((resp: any) => {
            if (resp.data.min_booking_period != null) {
                this.min_booking_period = resp.data.min_booking_period
            }
            this.price_per_night = resp.data.price_per_night
        })
    }

    ngOnInit() {

        this.thumbnail = this.api.vehicleThumbnailUrl(this.vehicleId)

    }
    plus() {
        const value = this.price_per_night + 1
        this.price_per_night = value
    }

    minus() {
        const value = this.price_per_night - 1
        if (value >= 1) {
            this.price_per_night = value
        }
    }

    showVal(e) {
        this.min_booking_period = e.target.value
    }

    browseImages(event: any) {
        event.preventDefault()
        const element = document.getElementById('other-images')
        element.click()
    }

    onImagesChange(event: any) {
        this.uploadFiles(event.target.files)
    }

    uploadFiles(files: FileList) {
        const allowedExtensions = ['png', 'jpg', 'jpeg']
        const defaulterFiles = []

        Array.from(files).forEach((file: any) => {
            const extension = file.name.split('.').pop().toLowerCase()
            if (allowedExtensions.indexOf(extension) > -1) {
                this.readFile(file)
            } else {
                defaulterFiles.push(file.name)
                this.alert.error(`${file.name} ` + (' Invalid File'))
            }
        })
    }

    readFile(file: any) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e: any) => {
            const index = this.uploadedImages.length
            this.uploadedImages.push({
                id: -1,
                image: reader.result
            })
            this.uploadImage(reader.result, index)
        }
    }
    uploadImage(imageData: any, index: number) {
        fetch(imageData)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                const formData = new FormData()
                formData.append('image', imageFile)
                formData.append('vehicle_id', this.vehicleId)
                this.ds.uploadImage(formData).subscribe((resp: any) => {
                    this.uploadedImages[index].id = resp.data
                    this.uploadedImages[index].vehicle_id = this.vehicleId
                    this.uploadedImages[index].uploading = false
                })
            })
    }

    deleteImage(index: number) {
        this.uploadedImages[index].image = this.spinnerSVG
        const params = {
            id: this.uploadedImages[index].id
        }
        this.ds.deleteImage(params).subscribe(resp => {
            this.uploadedImages.splice(index, 1)
        })
    }

    fileDragStartNext(e: any): void {
        e.preventDefault()
    }

    fileDragEndNext(e: any): void {
        e.preventDefault()
    }
    fileDroppedNext(e: any): void {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer && e.dataTransfer.files.length) {
            this.uploadFiles(e.dataTransfer.files)
        }
    }

    save() {
        this.Loading = true
        const params = {
            id: this.vehicleId,
            price_per_night: this.price_per_night,
            min_booking_period: this.min_booking_period
        }

        const requiredPromises: Array<any> = []

        const formData = this.api.jsonToFormData(params)
        const thumbnailPromise = fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                formData.append('thumbnail', imageFile)
            })
        requiredPromises.push(thumbnailPromise)
        Promise.all(requiredPromises)
            .then(_ => this.sendCall(formData))
    }

    sendCall(formData: FormData): void {
        this.ds.saveCamperProfile(formData)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.Loading = false
                    return false
                } else {
                    this.Loading = false
                    this.ds.data.vehicle_details.price_per_night = this.price_per_night
                    this.ds.data.vehicle_details.min_booking_period = this.min_booking_period
                    this.alert.success('Profile Details Added Successfully')
                    // this.router.navigateByUrl(`/lender-registration/camper-location`)
                    this.router.navigate(['../../camper-location/' + this.vehicleId], { relativeTo: this.route })
                }
            })
    }

    browseThumbnail(event: any) {
        event.preventDefault()
        const element = document.getElementById('thumbnail-image')
        element.click()
    }

    onThumbnailChange(event: any, template: TemplateRef<any>) {
        const file = event.target.files[0]
        const allowedExtensions = ['png', 'jpg', 'jpeg']
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            this.alert.error('File size must not exceed 3MB')
        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Format type is invalid.Required formats are PNG,JPG,JPEG')
        } else {
            this.imageChangedEvent = event
            this.cropperModalRef = this.modalService.show(
                template,
                Object.assign({}, { class: 'modal-md modal-dialog-centered modal-dialog-scrollable' })
            )
        }
    }
    doneCroppingThumbnail() {
        this.thumbnail = this.croppedImage
        document.getElementById('thumbnail-image').setAttribute('src', this.thumbnail)
        this.cropperModalRef.hide()
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64
    }

    // companyImageCropped(event: ImageCroppedEvent) {
    //     this.croppedCompanyImage = event.base64
    // }

    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

}
