import {Component, Input, ElementRef, ViewChild} from "@angular/core";
import {CommService, Directory, MediaServer, DataBrowse} from "../Services/CommService";

type BreadcrumbItem = MediaServer | Directory;
@Component({
    selector		: "m1m-media-browser",
    templateUrl		: "ts/Components/m1m-media-browser.html",
    styleUrls       : [ "ts/Components/m1m-media-browser.css",
                        "css/bulma.css"
                      ]
})
export class M1mMediaBrowser {
    @ViewChild("rootSection") rootSection: ElementRef;
    @ViewChild("dataSection") dataSection: ElementRef;
    clone               : HTMLElement;
    @Input() devices	: MediaServer[];
    private breadcrumb  : BreadcrumbItem  [] = [];
    private data        : DataBrowse;
    private ms          : MediaServer;
    constructor(private cs: CommService) {
        // console.log( "el:", el);
    }
    browse(item?: BreadcrumbItem) {
        if(item) {
            if( (item as Directory).directoryId) {
                this.browseDirectory( item as Directory);
            } else {
                this.browseMediaServer(item as MediaServer);
            }
        } else {
            this.data = null;
        }
    }
    mediaConsole() {
        console.log(this.data);
    }
    gettext() : string {
    	return "data-text = \"aaaa\"";
    }

    browseParent() {
        this.breadcrumb.pop();
        if(this.breadcrumb.length) {
            this.browse( this.breadcrumb.pop() );
        } else {
            this.breadcrumb = [];
            this.data = null;
            this.ms = null;
        }
    }
    getMediaDuration( media ) : string {
        if (media.duration.slice(0,1) !== "0" ) {
        	return media.duration.slice(0,7);
        } else {
        	return media.duration.slice(2,7);
        }
    }
    getCurrentParentName() : string {
        let res : string;
        if (this.breadcrumb.length > 1) {
            res = this.breadcrumb[ this.breadcrumb.length - 2].name;
        } else {
            res = "Liste des serveurs";
        }
        return res;
    }
    getCurrentItemName() : string {
        let res : string;
        if(this.breadcrumb.length) {
            res = this.breadcrumb[ this.breadcrumb.length - 1].name;
        } else {res = "";}
        return res;
    }
    browseMediaServer(ms: MediaServer) {
        if (ms === null) {
            this.breadcrumb = null;
        } else {
            this.breadcrumb = [ ms ];
        }
        this.ms         = ms;
        this.data       = null;
        if(ms) {
            this.browseDirectory();
        }
    }
    browseDirectory( directory?: Directory ) {
        let directoryId: string;
        if(directory) {
            directoryId = directory.directoryId;
            let keep = true;
            this.breadcrumb = this.breadcrumb.filter( D => keep && (keep=D !== directory) );
            this.breadcrumb.push(directory);
        } else {
            directoryId = "0";
        }
        if(this.clone) {
            this.clone.remove();
        }
        this.clone = this.dataSection.nativeElement.cloneNode(true);
        this.rootSection.nativeElement.insertBefore( this.clone, this.dataSection.nativeElement );
        this.clone.style.position = "relative";
        this.clone.style.top  = "0px";
        this.clone.style.left = "0px";
        this.clone.classList.remove("original");

        this.dataSection.nativeElement.classList.remove("original");

        this.data = null;
        return this.cs.browse( this.ms.id, directoryId ).then( (data) => {
            console.log( "Browse", this.ms.id, directoryId, "=>", data );
            this.data = data;
            this.dataSection.nativeElement.classList.add("original");
            this.clone.style.position = "absolute";
            this.clone.classList.add("clone");
        });
    }
}
