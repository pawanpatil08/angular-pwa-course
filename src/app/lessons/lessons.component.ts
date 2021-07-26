import {Component, OnInit} from '@angular/core';
import {LessonsService} from "../services/lessons.service";
import {Observable, of} from 'rxjs';
import {Lesson} from "../model/lesson";
import {SwPush} from "@angular/service-worker";
import {NewsletterService} from "../services/newsletter.service";
import {catchError} from 'rxjs/operators';

@Component({
    selector: 'lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

    lessons$: Observable<Lesson[]>;
    isLoggedIn$: Observable<boolean>;
    readonly VAPID_PUBLIC_KEY = "BF1BhDhSW89yKw6pWbLlzcDpCR3I3ViSCEiS_z0q_RP9-ablo5Up8HDIEP1-GauARtU7MxB6Yl_7FI8UvczPmaQ";
    sub:PushSubscription;

    constructor(
        private lessonsService: LessonsService,
        private swPush:SwPush,
        private newsletterService: NewsletterService) {

    }

    ngOnInit() {
        this.loadLessons();
    }


    loadLessons() {
        this.lessons$ = this.lessonsService.loadAllLessons().pipe(catchError(err => of([])));
    }

    subscribeToNotifications() {
        this.swPush.requestSubscription({
            serverPublicKey:this.VAPID_PUBLIC_KEY

        }).then(res=>{
            this.sub=res;
            console.log("Notification Subscription:",res);
            this.newsletterService.addPushSubscriber(res).subscribe(()=>{
                console.log("Subscription send to server"),
                err=> console.log("Subscription not send to server",err);
            });
        }).catch(err=>{
            console.log("could not subscribe to notification",err);
        })
    }


    sendNewsletter() {
        this.newsletterService.send().subscribe(()=>{
        })
    }

}
