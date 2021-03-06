import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LinkRepositoryService } from '../shared/link-repository.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PageVisitGQL } from '../../shared/pagevisit-gql.service';

@Component({
  selector: 'ks-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  dialogRef: MatDialogRef<any>;
  @ViewChild("notFoundTemplate") private notFoundDialog: TemplateRef<any>;

  // Close the dialog box and return to previous page
  close() {
    this.dialogRef.close();
    this.location.back();
  }

  // Get long URL and then redirect
  getRedirectLinkHttp(code: string) {
    this.linkRepository.getRedirectLink(code).subscribe(
      (responseBody) => {
        if(responseBody["long_url"] !== null) {
          // Log GraphQL Page Visit
          const userId = responseBody["user_id"]
          this.pageVisitGQL.createPageVisit(userId, '/'+code)
            .then((resObservable) => {
              resObservable.subscribe(({ data }) => {
                // 'data' contains the graphql response
              }, (error) => {
                console.log('there was an error sending the query: createPageVisit, ', error);
              });
            });

          // Redirect to new URL
          window.location.href = responseBody["long_url"];
        } else {
          // Open "Not Found" dialog box
          this.dialogRef = this.dialog.open(this.notFoundDialog);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('Error: PUT request for long URL failed:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      } // error
    ) // http subscribe
  }

  constructor(private linkRepository: LinkRepositoryService,
              private route: ActivatedRoute,
              private location: Location,
              private dialog: MatDialog,
              private pageVisitGQL: PageVisitGQL) { }

  ngOnInit() {
    let code = this.route.snapshot.paramMap.get('code');
    if(code !== '') {
      this.getRedirectLinkHttp(code);
    }
  } // ngOnInit
} // RedirectComponent
