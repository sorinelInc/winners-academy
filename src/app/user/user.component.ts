import {Component, Input, OnInit} from '@angular/core';
import {User} from '../models/user';
import {UserPage} from '../models/user-page';
import {UserService} from '../services/user.service';
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  editUserForm: FormGroup;
  addUserForm: FormGroup;

  constructor(private userService: UserService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.getPageUsers(0);
  }

  users: User[];
  pageUser: UserPage;
  selectedPage = 0;
  selectedUser: User;
  userTypeSelect = 'NORMAL';

  getPageUsers(requestedPage: number): void {
    this.userService.getPageUsers(requestedPage)
      .subscribe(page => this.pageUser = page);
  }

  ngOnInit() {
    this.editUserForm = this.formBuilder.group({
      username: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl('')
    });

    this.addUserForm = this.formBuilder.group({
      username: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl('')
    });
  }

  onSelect(page: number): void {
    this.selectedPage = page;
    this.getPageUsers(page);
  }

  selectUser(currentUser: User) {
    this.selectedUser = currentUser;
  }

  addUser(content) {
    this.modalService.open(content, {windowClass: 'modal-danger', centered: true}).result.then((result) => {
      this.userService.addUser(this.editUserForm.value).subscribe(
        user => {
          this.refreshData();
        },
        error => {
          window.alert(error.toLocaleString());
        }
      );
    });
  }

  editUser(content) {
    this.modalService.open(content, {windowClass: 'modal-danger', centered: true}).result.then((result) => {
      this.userService.editUser(this.selectedUser).subscribe(editedUser => {
          this.refreshData();
        },
        error => {
            window.alert(error.toString());
        });
    }, (reason) => {

    });
  }

  deleteUser(content) {
    this.modalService.open(content, {windowClass: 'modal-danger', centered: true}).result.then((result) => {
      this.userService.deleteUser(this.selectedUser.userId).subscribe(deletedUser => {
          this.refreshDataWhenDeleting();
        },
        error => {
          // TODO
        });
    }, (reason) => {
    });
  }

  private refreshDataWhenDeleting() {
    this.getPageUsers(this.selectedPage);
    if (this.pageUser.content.length === 1) {
      if (this.selectedPage !== 0) {
        this.selectedPage = this.selectedPage - 1;
        this.getPageUsers(this.selectedPage);
      } else {
        this.selectedUser = null;
      }
    }
    this.users = this.pageUser.content;
  }

  private refreshData() {
    this.getPageUsers(this.selectedPage);
    this.users = this.pageUser.content;
  }

}
