import { MenuService } from '../../services/menu.service';
import { AppSettings } from '../../settings/app.settings';
import { Component, OnInit } from '@angular/core';
import { Menu } from '../../model/menu.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menus: Menu[];
  logoPath = AppSettings.logoImagePath;
  
  constructor(private menuService: MenuService) { }  

  ngOnInit() {
    this.menus = this.menuService.getMenusAutenticado();  
    this.menuService.menusAutenticadoChanged.subscribe(
      menus => {
        this.menus = menus;
      }
    )
  }

}
