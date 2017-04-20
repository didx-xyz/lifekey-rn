/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Siphesande Malgas <sphe@io.co.za>
 */

import 'react-native';

import Api from '../Api'
import 'isomorphic-fetch'
import MockStorage from "../../App/Components/MockStorage"

const cache = {}
const AsyncStorage = new MockStorage(cache)

jest.setMock("AsyncStorage", AsyncStorage)

/* global test, describe */


describe('#requestConnection()', () => {
  it('rejects unknown values', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.requestConnection({target:'eewrr'})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()
  });
  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";

    try {
      const {data} = await Api.requestConnection({ target : null})
       } catch (e) {
       expect(e.message).toEqual(response);
     }
  });

it('rejects incorrect  params  (that are not objects)', async () => {
  const response = `Expected 'object', received 'number'`;
  try {
    const data = await Api.requestConnection(2)

     } catch (e) {
       expect(e.message).toEqual(response);
     }
  });
});


describe('#allConnections()', () => {
  it('rejects unknown/incorrect values', async () => {
    const response = "User not registered. Cannot send a signed request";
    const data = await Api.allConnections()
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
});

describe('#respondConnectionRequest()', () =>{
  it('rejects unknown values', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.respondConnectionRequest({user_connection_request_id:1, accepted:'weee'})
    .catch(error => expect(error).toEqual(response));
     expect(data).not.toBe(null);
  });

  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";

    try {
      const {data} = await Api.respondConnectionRequest({user_connection_request_id:null, accepted:null})
       } catch (e) {
       expect(e.message).toEqual(response);
     }
  });

  it('rejects incorrect  params values (that are not objects)', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.respondConnectionRequest(12332)
    } catch (e) {
       expect(e.message).toEqual(response);
     }
  });
});

// describe('#deleteConnection()', () =>{
//   it('rejects unknown values', async () => {
//     const response = 'User not registered. Cannot send a signed request';
//     const data = await Api.deleteConnection({user_connection_id:1})
//     .catch(error => expect(error).toEqual(response));
//     expect(data).not.toBe(null);
//   });
//   it('rejects incorrect null and undefined values', async () => {
//     const response = "null cannot be 'null' or 'undefined'";

//     try {
//       const {data} = await Api.deleteConnection({user_connection_id:null})
//        } catch (e) {
//          expect(e.message).toEqual(response);
//       }
//   });

 it('rejects incorrect params values (that are not objects)', async () => {
   const response = `Expected 'object', received 'number'`;
   try {
     const data = await Api.deleteConnection(3334)
   } catch (e) {
     expect(e.message).toEqual(response);
     }
  });
});

describe('#activate()', () =>{
  it('rejects unknown values', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.activate({ activation_code: 1234455 })
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";

    try {
      const {data} = await Api.activate({activation_code:null})
       } catch (e) {
       expect(e.message).toEqual(response);
     }
  });

 it('rejects incorrect  params values (that are not objects)', async () => {
   const response = `Expected 'object', received 'number'`;
   try {
    const data = await Api.activate(2)
   } catch (e) {
       expect(e.message).toEqual(response);
     }
  });
})


describe('#requestISA()', () =>{
  it('Testing for async errors using `catch`, POST /management/isa', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.requestISA({to:'assd',
                                       requested_schemas:"wwee",
                                       purpose:"weee",
                                       license:"gggg"})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);

  });
  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";
    try {
      const {data} = await Api.requestISA({to:null,
                                         requested_schemas:null,
                                         purpose:"weee",
                                         license:"gggg"})
      return Promise.reject(new Error('should not be called'))
      }catch (e) {
      expect(e.message).toEqual(response);
      return Promise.resolve()
     }
  });

  it('rejects incorrect values that are not objects', async () => {
    const number = 2
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.profile(number)

    } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
})


describe('#respondISA()', () =>{
  it('rejects incorrect params', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.respondISA({ isa_id:2, accepted: 1, permitted_resources: 'qwerrr' })
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });

  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";

    try {
      const {data} = await Api.respondISA({ isa_id : null , accepted: null, permitted_resources: null })
    }catch (e) {
      expect(e.message).toEqual(response);
     }
  });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
     const data = await Api.respondISA(2)

    } catch (e) {
    expect(e.message).toEqual(response);
   }
  });
})


describe('#allISAs()', () =>{
  it('rejects incorrect params', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.allISAs()
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    });
})

describe('#getISA', () =>{
  it('rejects incorrect params', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.getISA({id:2})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";

    try {
      const {data} = await Api.getISA({id:null})
   } catch (e) {
        expect(e.message).toEqual(response);
     }
  });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.getISA(2)

    } catch (e) {
     expect(e.message).toEqual(response);
    }

  });
})

describe('#deleteISA', () =>{
  it('rejects incorrect params', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.deleteISA({isa_id:2})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);

  });
  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";

    try {
      const {data} = await Api.deleteISA({isa_id:null})
   } catch (e) {
        expect(e.message).toEqual(response);
     }
  });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.register(2)

    }catch (e) {
      expect(e.message).toEqual(response);
    }
  });

})


describe('#qrCode', () =>{
  it('rejects unknown values', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.qrCode({user_id:2})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);

  });
  it('rejects incorrect values that are null', async () => {
    const response = "null cannot be 'null' or 'undefined'";

    try {
      const {data} = await Api.qrCode({user_id:null})
   } catch (e) {
        expect(e.message).toEqual(response);
     }
  });

  it('rejects incorrect values that are not objects', async () => {
  const response = `Expected 'object', received 'number'`;
  try {
    const data = await Api.qrCode(3)

   } catch (e) {
    expect(e.message).toEqual(response);
  }
});

})

describe('#updateISA', () =>{
  it('rejects unknown values', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.updateISA({isa_id:2, permitted_resources:"weerr"})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });

  it('rejects incorrect values that are null', async () => {
    const response = "null cannot be 'null' or 'undefined'";

    try {
      const {data} = await Api.updateISA({isa_id:null, permitted_resources:null})
   } catch (e) {
      expect(e.message).toEqual(response);
     }
  });

 it('rejects incorrect values that are not objects', async () => {
   const response = `Expected 'object', received 'number'`;
   try {
     const data = await Api.updateISA(4)
   } catch(e) {
     expect(e.message).toEqual(response);
   }
  });
})


describe('#pullISA()', () =>{
  it('rejects unknown values', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.pullISA({isa_id:1})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
   });

   it('rejects incorrect values that are null', async () => {
     const response = "null cannot be 'null' or 'undefined'";

     try {
       const {data} = await Api.pullISA({isa_id:null})
    } catch (e) {
         expect(e.message).toEqual(response);
      }
   });

 it('rejects incorrect values that are not objects', async () => {
   const response = `Expected 'object', received 'number'`;
   try {
   const data = await Api.pullISA(3)

    } catch (e) {
     expect(e.message).toEqual(response);
   }
 });
})

describe('#pushISA()', () =>{
  it('rejects unknown values', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.pushISA({isa_id:2, resources:'jfjffjfj'})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    });

   it('rejects incorrect values that are null', async () => {
      const response = "null cannot be 'null' or 'undefined'";

      try {
        const {data} = await Api.pushISA({isa_id:null, resources:null})
     } catch (e) {
          expect(e.message).toEqual(response);
       }
    });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
    const data = await Api.register(2)

     } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
})


describe('#allResources', () => {

 it('rejects unknown values', async () => {
   const response =  'User not registered. Cannot send a signed request';
   const data = await Api.allResources()
    .catch(error => expect(error).toEqual(response));
  })
 })


describe('#getResource()', () => {

 it('rejects unknown values', async () => {
   const response =  'User not registered. Cannot send a signed request';
   const data = await Api.getResource({id:1})
    .catch(error => expect(error).toEqual(response));
 })

 it('rejects incorrect null values ', async () => {
    const response = "null cannot be 'null' or 'undefined'";
    try {
      const {data} = await Api.getResource({id:null})
      return Promise.reject(new Error('should not be called'))
    } catch (e) {
        expect(e.message).toEqual(response);
        return Promise.resolve()
    }
  });

  it('rejects incorrect values that are not objects', async () => {
    const number = 2
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.getResource(number)
    } catch (e) {
     expect(e.message).toEqual(response);
   }
  })
});


describe('#createResource()', () => {

 it('rejects unknown values', async () => {
   const response =  'User not registered. Cannot send a signed request';
   const data = await Api.createResource({
     entity:'c89c0fa4e0bc450922dfaf51986f2e2bd538618f',
     attribute:'snapshotSerializers',
     alias:'dd',
     mime:'ggg',
     value:2,
     uri:4,
     is_verifiable_claim:'hh',
     schema:'gg',
     is_default:'nn',
     is_archived:'hh'
   })
    .catch(error => expect(error).toEqual(response));
 })

 it('rejects incorrect null values ', async () => {
    const response = "null cannot be 'null' or 'undefined'";
    try {
      const {data} = await Api.createResource({
        entity:null,
        attribute:null,
        alias:null,
        mime:null,
        value:null,
        uri:null,
        is_verifiable_claim:null,
        schema:null,
        is_default:null,
        is_archived:null
      })
      return Promise.reject(new Error('should not be called'))
    } catch (e) {
        expect(e.message).toEqual(response);
        return Promise.resolve()
    }
  });

  it('rejects incorrect params (that are not objects)s', async () => {
    const number = 2
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.createResource(number)
    } catch (e) {
     expect(e.message).toEqual(response);
   }
  })
});


describe('#updateResource()', () => {

 it('rejects unknown values', async () => {
   const response =   "User not registered. Cannot send a signed request";
   const data = await Api.updateResource({id:1})
    .catch(error => expect(error).toEqual(response));
 })

  })

describe('#deleteResource()', () => {

 it('rejects unknown values', async () => {
   const response =  "User not registered. Cannot send a signed request"
   const data = await Api.deleteResource({ id: 2 })
    .catch(error => expect(error).toEqual(response));
 })

 it('rejects incorrect null values ', async () => {
    const response = "null cannot be 'null' or 'undefined'";
    try {
      const {data} = await Api.deleteResource({id:null})
      return Promise.reject(new Error('should not be called'))
    } catch (e) {
        expect(e.message).toEqual(response);
        return Promise.resolve()
    }
  });

  it('rejects incorrect params (that are not objects)', async () => {
    const number = 2
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.deleteResource(2)
    } catch (e) {
     expect(e.message).toEqual(response);
   }
  })
});


describe('#profile()', () => {

 it('rejects incorrect values', async () => {
   const response =  "user record not found";
   const data = await Api.profile({ did:1 })
    .catch(error => expect(error.message).toEqual(response));
 })

 it('rejects incorrect null values ', async () => {
    const response = "null cannot be 'null' or 'undefined'";
    try {
      const {data} = await Api.profile({ did: null })
      return Promise.reject(new Error('should not be called'))
    } catch (e) {
        expect(e.message).toEqual(response);
        return Promise.resolve()
    }
  });

  it('rejects incorrect params (that are not objects)', async () => {
    const number = 2
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.profile(number)
    } catch (e) {
     expect(e.message).toEqual(response);
   }
  })
});

describe('#register()', () => {
  it('rejects incorrect values', async () => {
    const response =  "unsupported key algorithm";
    const data = await Api.register({email:"sphe@io.co.za",
                                     nickname: "sphe",
                                     device_id:'PI',
                                     device_platform:"Android",
                                     public_key_algorithm:"addsfgggggg",
                                     public_key:"23444",
                                     plaintext_proof:"fgfg",
                                     signed_proof:"ggf"
                                   })
    .catch(error => expect(error.message).toEqual(response));
  })
  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";
      try {
        const {data} = await Api.register({email:null,
                                         nickname: null,
                                         device_id:'PI',
                                         device_platform:"Android",
                                         public_key_algorithm:"addsfgggggg",
                                         public_key:"23444",
                                         plaintext_proof:"fgfg",
                                         signed_proof:"ggf"
                                       })
     } catch (e) {
          expect(e.message).toEqual(response);
       }
    });

  it('rejects incorrect  params', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
      const data = await Api.register(2)

     } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
});

describe('#device()', () => {
  it('rejects unknown values', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.device({device_id:2, device_platform:"ios"})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);

  });

  it('rejects incorrect null and undefined values', async () => {
    const response = "null cannot be 'null' or 'undefined'";
    try {
      const {data} = await Api.device({device_id:null, device_platform:null })
       }catch (e) {
         expect(e.message).toEqual(response);
       }
  });

  it('rejects incorrect params that are not objects', async () => {
  const response = `Expected 'object', received 'number'`;
  try {
    const data = await Api.device(2)

  } catch (e) {
    expect(e.message).toEqual(response);
  }
  });
});


describe('#profileColour()', () =>{
  it('rejects unknown values', async () => {
    const response = "User not registered. Cannot send a signed request";
    const data = await Api.profileColour({colour:"sphe@example.com"})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
  it('rejects incorrect values that are null', async () => {
      const response = "null cannot be 'null' or 'undefined'";

      try {
        const {data} = await Api.profileColour({ colour: null })
     } catch (e) {
          expect(e.message).toEqual(response);
       }
    });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
    const data = await Api.profileColour(4)

     } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
})


describe('#profileImage()', () =>{
  it('rejects unknown values', async () => {
    const response = "User not registered. Cannot send a signed request";
    const data = await Api.profileImage({ image_uri: ""})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
  it('rejects incorrect values that are null', async () => {
      const response = "null cannot be 'null' or 'undefined'";

      try {
        const {data} = await Api.profileImage({ image_uri: null })
     } catch (e) {
          expect(e.message).toEqual(response);
       }
    });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
    const data = await Api.profileImage(2)

     } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
})


describe('#profileName()', () =>{
  it('rejects unknown values', async () => {
    const response = "User not registered. Cannot send a signed request";
    const data = await Api.profileName({ name: "Denver" })
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
  it('rejects incorrect values that are null', async () => {
      const response = "null cannot be 'null' or 'undefined'";

      try {
        const {data} = await Api.profileName({ name: null })
     } catch (e) {
          expect(e.message).toEqual(response);
       }
    });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
    const data = await Api.profileName(2)

     } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
})


describe('#profileEmail(data)', () =>{
  it('rejects unknown values', async () => {
    const response = "User not registered. Cannot send a signed request";
    const data = await Api.profileEmail({email:"sphe@example.com"})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
  it('rejects incorrect values that are null', async () => {
      const response = "null cannot be 'null' or 'undefined'";

      try {
        const {data} = await Api.profileEmail({ email: null })
     } catch (e) {
          expect(e.message).toEqual(response);
       }
    });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
    const data = await Api.profileEmail(4)

     } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
})

describe('#profileTel(data)', () =>{
  it('rejects unknown values', async () => {
    const response = "User not registered. Cannot send a signed request";
    const data = await Api.profileTel({ tel: 7374567778 })
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
  it('rejects incorrect values that are null', async () => {
      const response = "null cannot be 'null' or 'undefined'";

      try {
        const {data} = await Api.profileTel({ tel: null })
     } catch (e) {
          expect(e.message).toEqual(response);
       }
    });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
    const data = await Api.profileTel(2)

     } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
})
describe('#profileAddress()', () =>{
  it('rejects unknown values', async () => {
    const response = "User not registered. Cannot send a signed request";
    const data = await Api.profileAddress({ address: "31 Loop Street, Cape Town" })
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
  it('rejects incorrect values that are null', async () => {
      const response = "null cannot be 'null' or 'undefined'";

      try {
        const {data} = await Api.profileAddress({ address: null })
     } catch (e) {
          expect(e.message).toEqual(response);
       }
    });

  it('rejects incorrect values that are not objects', async () => {
    const response = `Expected 'object', received 'number'`;
    try {
    const data = await Api.profileAddress(2)

     } catch (e) {
      expect(e.message).toEqual(response);
    }
  });
})

describe('#myProfile()', () =>{
  it('rejects unknown values', async () => {
    const response =  "User not registered. Cannot send a signed request";
    const data = await Api.myProfile()
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
  });
})

describe('#unregister()', () =>{
  it('rejects unknown values', async () => {
    const response =  "user record not found";
    const data = await Api.unregister({id:1, email:'sphe@io.co.za'})
    .catch(error => expect(error.message).toEqual(response));
    expect(data).not.toBe(null);
  });
})

describe('#getActiveBots()', () =>{
  it('fetch correctly', async () => {
    const response = await Api.getActiveBots()
    const data = await response.text();
    expect(data).toBeDefined();
    expect(data).not.toBe(null);
  });
})

describe('request', () => {
  it('fetch correctly', async () => {
    const response = await fetch('http://staging.api.lifekey.cnsnt.io')
    const data = await response.text();
    expect(data).toBeDefined();
    expect(data).not.toBe(null);
  });
});
