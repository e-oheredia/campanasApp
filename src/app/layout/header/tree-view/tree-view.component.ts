import { Menu } from './../../../model/menu.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: '[app-tree-view]',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent {
  @Input() menus: Menu[];
}
