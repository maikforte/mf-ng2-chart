import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class UtilityService {

  constructor() { }

  public setDefaults(options, defaults) {
    return _.defaults({}, _.clone(options), defaults);
  }

}
