import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsCFEComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsCFEComponent;
  let fixture: ComponentFixture<ReportsCFEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsCFEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsCFEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
