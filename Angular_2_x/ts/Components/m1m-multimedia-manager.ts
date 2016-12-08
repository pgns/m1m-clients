import { Component, Input 	} from "@angular/core";
import {CommService, DataDlnaDevices, MediaServer, MediaRenderer} from "../Services/CommService";

@Component({
    selector		: "comp-multimedia-manager",
    templateUrl		: "ts/Components/m1m-multimedia-manager.html",
    styleUrls       : [ "ts/Components/m1m-multimedia-manager.css", "css/bulma.css"]
})
export class CompMultimediaManager {
    @Input() title	: string;
    currentRenderer : MediaRenderer;
    mediaRenderers  : MediaRenderer[] = [];
    mediaServers    : MediaServer  [] = [];
    constructor(private comm: CommService) {
        //console.log( "CommService:", comm);
        comm.init( localStorage.getItem( "TActHab_adresse" ) ).subscribe( (data: DataDlnaDevices) => {
            //console.log( "init =>", data );
            this.mediaRenderers = data.mediaRenderers;
            this.mediaServers   = data.mediaServers;
        });
    }
    getCurrentMediaRendererName() : string {
        if(this.currentRenderer) {
            return this.currentRenderer.name;
        } else {
            return "none";
        }
    }
    selectMediaRenderer(mr: MediaRenderer) {
        this.currentRenderer = mr;
    }

    clicked() {
        alert("clicked");
    }
}
