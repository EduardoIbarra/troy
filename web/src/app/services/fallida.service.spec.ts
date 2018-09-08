import { TestBed, inject } from '@angular/core/testing';

import { FallidaService } from './fallida.service';

describe('FallidaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FallidaService]
    });
  });

  it('should be created', inject([FallidaService], (service: FallidaService) => {
    expect(service).toBeTruthy();
  }));
});
