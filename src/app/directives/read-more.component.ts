import { style } from '@angular/animations';
import { Component, Input, ElementRef, OnChanges } from '@angular/core'

@Component({
    selector: 'app-read-more',
    template: `
        <div [innerHTML]="currentText">
        </div>
        <a [class.hidden]="hideToggle" class="read-more" (click)="toggleView()" *ngIf="currentText?.length > maxLength">Show {{isCollapsed? 'More...' : 'Less'}}</a>
    `,
    styles: [`
        .read-more {
            /* color: #000;
            font-weight: bold;
            cursor: default; */
            font-weight: bold;
            padding: 12px 20px;
            display: inline-block;
            border-radius: 5px;
            /* border: 1px solid #c2a674; */
            margin: 10px 0 0;
            /* color: #c2a674; */
        }
        a.read-more:hover {
            color: #c2a674;
            cursor: pointer;
        }
    `]
})

export class ReadMoreComponent implements OnChanges {
    @Input() text: string
    @Input() maxLength = 100
    currentText: string
    hideToggle = true
    public isCollapsed = true

    constructor(private elementRef: ElementRef) {

    }
    toggleView() {
        this.isCollapsed = !this.isCollapsed
        this.determineView()
    }
    determineView() {
        if (!this.text || this.text.length <= this.maxLength) {
            this.currentText = this.text
            this.isCollapsed = false
            this.hideToggle = true

            return false
        }

        this.hideToggle = false
        if (this.isCollapsed == true) {
            this.currentText = this.text.substring(0, this.maxLength) + '...'
        } else if (this.isCollapsed == false) {
            this.currentText = this.text
        }

    }
    ngOnChanges() {
        this.determineView()
    }
}
