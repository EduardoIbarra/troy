import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FallidaComponent } from './fallida.component';

describe('FallidaComponent', () => {
  let component: FallidaComponent;
  let fixture: ComponentFixture<FallidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FallidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FallidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
