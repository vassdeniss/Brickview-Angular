import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Editor } from 'ngx-editor';
import { Observable, map } from 'rxjs';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  editor!: Editor;
  content: string = 'mow';
  sets$!: Observable<Set[]>;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.sets$ = this.activatedRoute.data.pipe(map((data) => data['sets']));
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
