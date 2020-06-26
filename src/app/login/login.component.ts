import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  messageError: string;
  loading: boolean;
  returnUrl: string;

  constructor(
    private fb: FormBuilder, private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) {
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
    }

  ngOnInit(): void {
    this.initForm();

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    this.messageError = '';
    this.loading = true;
    const { username, password } = this.loginForm.value;
    this.authenticationService.login(username, password)
      .pipe(first())
      .subscribe(
        () => {
          this.loading = false;
          this.router.navigateByUrl(this.returnUrl);
        }, error => {
          this.loading = false;
          this.messageError = error;
        });
  }

}
