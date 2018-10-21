import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MymaterialComponent } from './material.component';

describe('MaterialComponent', () => {
  let component: MymaterialComponent;
  let fixture: ComponentFixture<MymaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MymaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MymaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
