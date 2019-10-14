/** AmbitJsX library - a neXt Ambit queries JavaScript library.
 * The main file, integrating all of the skills.
 *
 * Author: Ivan (Jonan) Georgiev
 * Copyright © 2019, IDEAConsult Ltd. All rights reserved.
 */

import Ambit from './Core';

import _Paging from './Paging';
import _Tasking from './Tasking';
import _Configuring from './Configuring';
import _Querying from './Querying';

Ambit.Paging = _Paging;
Ambit.Tasking = _Tasking;
Ambit.Querying = _Querying;
Ambit.Configuring = _Configuring;

// Now is time for all the supported services.
import s_Auth from './services/Authorization';
import s_Model from './services/Modelling';
import s_Algorithm from './services/Algorithming';

Ambit.Authorization = s_Auth;
Ambit.Modelling = s_Model;
Ambit.Algorithming = s_Algorithm;

export default Ambit;
