// external dependencies
import React from "react"
import { Text, View, Image } from "react-native"
import { Container, Content, Col } from "native-base"
import PropTypes from "prop-types"

// internal dependencies
import Api from "../Api"
import Scene from "../Scene"
import Palette from "../Palette"
import LifekeyHeader from "../Components/LifekeyHeader"
import LifekeyCard from "../Components/LifekeyCard"
import LcAddCategoryButton from "../Components/lc-AddCategoryButton"
import Touchable from "../Components/Touchable"
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import HelpIcon from "../Components/HelpIcon"
import Design from "../DesignParameters"
import Logger from "../Logger"

import MyData from "../Components/SceneComponents/MyData"
import Connect from "../Components/SceneComponents/Connect"

const CONNECT = 0
const MY_DATA = 1
const BADGES = 2

var person = {
  mycode: '+',
  facematch: '-',
}

class Me extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      activeTab: MY_DATA,
      tabName: "My Data",
      resources: {},
      resourceTypes: [],
      informationSource: "MY CODE"
    }

    this.onBoundResourceTypes = this.onResourceTypes.bind(this)
    this.onBoundResources = this.onResources.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()   

    Promise.all([
      this.onClearCache(),
      Api.allResourceTypes()
    ]).then(values => { 
      this.onBoundResourceTypes(values[1])
      this.sortMyData(this.state.resources, this.state.resourceTypes)
    }).catch(error => {
      Logger.error(error)
    });
  }

  componentWillFocus() {
    super.componentWillFocus()
    this.onClearCache()
  }

  onClearCache() {
    if (this.context.getShouldClearResourceCache()) {
      this.setState({
        "resources": {}
      })  
      return Api.allResources()
                .then(this.onBoundResources)
                .catch(e => alert("All RESOURCES ERROR: " + e))
    }
    return Promise.resolve()
  }

  sortMyData(resources, resourceTypes){

    resourceTypes.push({ name: 'Malformed', url: null, items: [] })
    resourceTypes.map(rt => {
      rt.items = []
      resources.forEach(r => {
        if(`${rt.url}_form` === r.form){
          rt.items.push(r)
        }
      })
      return rt
    })

    this.setState({
      "myData": resourceTypes
    })
  }

  onResourceTypes(data) {
    if (!data.resources) {
      console.warn("resource list format changed")
    }

    this.setState({
      resourceTypes: data.resources
    })
  }

  onResources(data) {

    const updatedResources = data.body.map((item) => {
      return {
        id: item.id,
        alias: item.alias,
        ...JSON.parse(item.value)
      }
    })

    if(this.state.resourceTypes && this.state.resourceTypes.length)
      this.sortMyData(updatedResources, this.state.resourceTypes)
    
    this.setState({
      resources: updatedResources
    })
    
  }

  onPressDelete(id) {
    Api.deleteResource({ id })
    .catch(error => Logger.error(error))
    // refresh the list
    this.context.onSaveResource()
    this.onClearCache()
  }

  onPressEdit(form, id = null) {
    this.context.onEditResource(form, id)
  }

  renderTab() {
    switch (this.state.activeTab) {

    case CONNECT:
      return <Connect></Connect> 
    case MY_DATA: {
      return this.state.myData && <MyData data={this.state.myData} notifyParent={this.onClearCache.bind(this)}></MyData>
    }
    case BADGES:
      return (
        <View style={style.content}>
          <View style={style.badge}>
            <View style={style.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={style.badgeContent}>
              <View style={style.badgeName}>
                <Text style={style.badgeNameText}>
                  Absa RICA
                </Text>
              </View>
              <View style={style.badgeDescription}>
                <Text style={style.badgeDescriptionText}>
                  Complete RICA documentation with verification from Absa Bank.
                </Text>
              </View>
            </View>
          </View>

          <View style={style.badge}>
            <View style={style.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={style.badgeContent}>
              <View style={style.badgeName}>
                <Text style={style.badgeNameText}>
                  LifeLock
                </Text>
              </View>
              <View style={style.badgeDescription}>
                <Text style={style.badgeDescriptionText}>
                  Get a trust score of 4.5 or higher on the LifeKey platform.
                </Text>
              </View>
            </View>
          </View>

          <View style={style.badge}>
            <View style={style.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={style.badgeContent}>
              <View style={style.badgeName}>
                <Text style={style.badgeNameText}>
                  ThisIsMe Verified
                </Text>
              </View>
              <View style={style.badgeDescription}>
                <Text style={style.badgeDescriptionText}>
                  Complete all required fields to get a trustworthy verification from ThisIsMe.
                </Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }

  render() {
    const headerIcons = [
      {
        icon: <BackIcon width={16} height={16}/>,
        onPress: () => this.navigator.pop()
      },
      {
        icon: <Image source={require('../Images/smiley_speech_bubble.png')}/>,
      },
      {
        icon: <Text>+</Text>,
        onPress: () => alert("test")
      }
    ]

    return (
      <Container>
        <View style={style.headerWrapper}>
          <BackButton navigator={this.navigator} />
          <LifekeyHeader
            icons={headerIcons}
            tabs={[
              {
                text: "Connect",
                onPress: () => this.setState({ activeTab: CONNECT }),
                active: this.state.activeTab === CONNECT
              },
              {
                text: "My Data",
                onPress: () => this.setState({ activeTab: MY_DATA }),
                active: this.state.activeTab === MY_DATA
              },
              {
                text: "Badges",
                onPress: () => this.setState({ activeTab: BADGES }),
                active: this.state.activeTab === BADGES
              }
            ]}
            />
        </View>
        <Content style={style.contentContainer}>
          {this.renderTab()}
        </Content>
      </Container>
    )
  }
}

const style = {
  "headerWrapper": {
    "borderColor": Palette.consentGrayDark,
    "height": Design.lifekeyHeaderHeight
  },
  "content": {
    "backgroundColor": "#eee"
  },
  "contentContainer":{
    "flex": 1
  },
  "connectTab": {
    "flex": 1,
    // "height": `${100 - Design.navigationContainerHeight}%`,
    "backgroundColor": Palette.consentGrayLightest,
    "alignItems": "center",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  "badge": {
    "flex": 1,
    "flexDirection": "row",
    "margin": 15,
    "marginBottom": 0,
    "paddingBottom": 15,
    "borderBottomWidth": 2,
    "borderBottomColor": "#ddd"
  },
  "badgeImage": {
    "width": 80,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "badgeContent": {
    "flex": 1,
    "flexDirection": "column"
  },
  "badgeName": {
    "flex": 1
  },
  "badgeNameText": {
    "fontWeight": "bold",
    "color": "#333"
  },
  "badgeDescription": {
    "flex": 1
  },
  "badgeDescriptionText": {
    "color": "#666"
  },
  "switchButtonContainer":{
    "flex": 2,
    "flexDirection": "row",
    "width": "75%",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "switchButton":{
    "height": 30,
    "width": "40%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "borderColor": Palette.consentBlue,
    "borderWidth": 1,
    "paddingLeft": 15,
    "paddingRight": 15,
  },
  "switchButtonLeft":{
    "borderTopLeftRadius": 20,
    "borderBottomLeftRadius": 20
  },
  "switchButtonRight":{
    "borderTopRightRadius": 20,
    "borderBottomRightRadius": 20
  },
  "switchButtonText":{
    "fontSize": 10
  },
  "informationContainer":{
    "flex": 6,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "qrCodeContainer": {
    "flex": 4,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "textContainer": {
    "flex": 2,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "text":{
    "color": Palette.consentGrayDark,
    "textAlign": "center",
  },
  "footer": {
    "flex": 1,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "space-between"
  },
  "footerText": {
    "fontSize": 16,
    "color": Palette.consentGrayDark,
  }
}

// these are from Lifekeyrn
Me.contextTypes = {
  // behavior
  onEditResource: PropTypes.func,
  onSaveResource: PropTypes.func,

  // state
  getShouldClearResourceCache: PropTypes.func
}

export default Me



// // external dependencies
// import React from "react"
// import { Text, View, WebView } from "react-native"
// import { Container, Content } from "native-base"
// import PropTypes from "prop-types"
// import _ from 'lodash'

// // internal dependencies
// import Api from "../Api"
// import Scene from "../Scene"
// import Session from "../Session"
// import Palette from "../Palette"
// import Design from "../DesignParameters"
// import Routes from "../Routes"
// import Config from "../Config"
// import Logger from "../Logger"
// import MvTemplate from "../Components/mv-Template"
// import LifekeyHeader from "../Components/LifekeyHeader"
// import LifekeyCard from "../Components/LifekeyCard"

// import RcPerson from "../Components/ResourceComponents/rc-Person"
// import RcIdentity from "../Components/ResourceComponents/rc-Identity"
// import RcContact from "../Components/ResourceComponents/rc-Contact"
// import RcAddress from "../Components/ResourceComponents/rc-Address"
// import RcEmployment from "../Components/ResourceComponents/rc-Employment"
// import RcProofOfResidence from "../Components/ResourceComponents/rc-ProofOfResidence"
// import RcProofOfEmployment from "../Components/ResourceComponents/rc-ProofOfEmployment"
// import LcAddCategoryButton from "../Components/lc-AddCategoryButton"
// import Touchable from "../Components/Touchable"
// import BackButton from "../Components/BackButton"
// import Button from "../Components/Button"
// import BackIcon from "../Components/BackIcon"
// import HelpIcon from "../Components/HelpIcon"

// class Me extends Scene {
//   constructor(...params) {
//     super(...params)

//     this.state = {
//       "tabName":  "My Data",
//       "resources": {},
//       "resourceTypes": []
//     }

//     this.onBoundResourceTypes = this.onResourceTypes.bind(this)
//     this.onBoundResources = this.onResources.bind(this)
//   }

//   componentDidMount() {
//     super.componentDidMount()   

//     Promise.all([
//       this.onClearCache(),
//       Api.allResourceTypes()
//     ]).then(values => { 
//       this.onBoundResourceTypes(values[1])
//       this.sortResources(this.state.resources, this.state.resourceTypes)
//     }).catch(error => {
//       Logger.error(error)
//     });
//   }

//   componentWillFocus() {
//     super.componentWillFocus()
//     this.onClearCache()
//   }

//   onClearCache() {
//     if (this.context.getShouldClearResourceCache()) {
//       this.setState({
//         "resources": {}
//       })  
//       return Api.allResources().then(this.onBoundResources).catch(e => alert("All RESOURCES ERROR: " + e))
//     }
//     return Promise.resolve()
//   }

//   onResourceTypes(data) {
//     if (!data.resources) {
//       console.warn("resource list format changed")
//     }

//     this.setState({
//       "resourceTypes": data.resources
//     })
//   }

//   onResources(data) {
//     this.setState({
//       "resources": data.body.map((item) => {
//         return {
//           "id": item.id,
//           "alias": item.alias,
//           ...JSON.parse(item.value)
//         }
//       })
//     })
//   }

//   onPressDelete(id) {
//     Api.deleteResource({ id })

//     // refresh the list
//     this.context.onSaveResource()
//     this.onClearCache()
//   }

//   onPressEdit(form, id = null) {
//     this.context.onEditResource(form, id)
//   }

//   sortResources(resources, resourceTypes){

//     resourceTypes.push({ name: 'Malformed', url: null, items: [] })
//     resourceTypes.map(rt => {
//       rt.items = []
//       resources.forEach(r => {
//         if(`${rt.url}_form` === r.form){
//           rt.items.push(r)
//         }
//       })
//       return rt
//     })

//     this.setState({
//       "resourceTypes": resourceTypes
//     })
//   }

//   validResourceType(resourceType){
//     return (!!resourceType && !!resourceType.items && !!resourceType.items.length)
//   }

//   Person_render(resourceType) {
//     if(!this.validResourceType(resourceType)) return
//     return ( 
//       <RcPerson resourceType={resourceType} 
//                 onPressEdit={this.onPressEdit.bind(this)} 
//                 onPressDelete={this.onPressDelete.bind(this)} 
//                 onEditResource={this.context.onEditResource.bind(this)}></RcPerson> 
//     )
//   }

//   Identity_render(resourceType) {
//     if(!this.validResourceType(resourceType)) return
//     return ( 
//       <RcIdentity resourceType={resourceType} 
//                 onPressEdit={this.onPressEdit.bind(this)} 
//                 onPressDelete={this.onPressDelete.bind(this)} 
//                 onEditResource={this.context.onEditResource.bind(this)}></RcIdentity> 
//     )
//   }

//   Contact_render(resourceType) {
//     if(!this.validResourceType(resourceType)) return
//     return ( 
//       <RcContact resourceType={resourceType} 
//                 onPressEdit={this.onPressEdit.bind(this)} 
//                 onPressDelete={this.onPressDelete.bind(this)} 
//                 onEditResource={this.context.onEditResource.bind(this)}></RcContact> 
//     )
//   }

//   Address_render(resourceType) {
//     if(!this.validResourceType(resourceType)) return
//     return ( 
//       <RcAddress resourceType={resourceType} 
//                 onPressEdit={this.onPressEdit.bind(this)} 
//                 onPressDelete={this.onPressDelete.bind(this)} 
//                 onEditResource={this.context.onEditResource.bind(this)}></RcAddress> 
//     )
//   }

//   Employment_render(resourceType) {
//     if(!this.validResourceType(resourceType)) return
//     return ( 
//       <RcEmployment resourceType={resourceType} 
//                 onPressEdit={this.onPressEdit.bind(this)} 
//                 onPressDelete={this.onPressDelete.bind(this)} 
//                 onEditResource={this.context.onEditResource.bind(this)}></RcEmployment> 
//     )
//   }

//   ProofOfResidence_render(resourceType) {
//     if(!this.validResourceType(resourceType)) return
//     return ( 
//       <RcProofOfResidence resourceType={resourceType} 
//                 onPressEdit={this.onPressEdit.bind(this)} 
//                 onPressDelete={this.onPressDelete.bind(this)} 
//                 onEditResource={this.context.onEditResource.bind(this)}></RcProofOfResidence> 
//     )
//   }

//   ProofOfEmployment_render(resourceType) {
//     if(!this.validResourceType(resourceType)) return
//     return ( 
//       <RcProofOfEmployment resourceType={resourceType} 
//                 onPressEdit={this.onPressEdit.bind(this)} 
//                 onPressDelete={this.onPressDelete.bind(this)} 
//                 onEditResource={this.context.onEditResource.bind(this)}></RcProofOfEmployment> 
//     )
//   }

//   Malformed_render(resourceType) {
//     if(!this.validResourceType(resourceType)) return

//     return ( 
//       <View>
//         { resourceType.items.map((resource, i) => {
//           return (
//             <LifekeyCard key={i} headingText={"resource " + resource.id} onPressDelete={() => this.onPressDelete(resource.id)}>
//               <Text>{resource.id} (malformed)</Text>
//             </LifekeyCard>
//           ) 
//         })}
//         <LcAddCategoryButton name={resourceType.name} form={resourceType.url + "_form"} onEditResource={this.context.onEditResource} />
//       </View>
//     )
//   }

//   render() {

//     const person = this.state.resourceTypes.find(rt => rt.name === "Person"); 
//     const identity = this.state.resourceTypes.find(rt => rt.name === "Identity"); 
//     const email = this.state.resourceTypes.find(rt => rt.name === "Email"); 
//     const mobile = this.state.resourceTypes.find(rt => rt.name === "Mobile Phone"); 
//     const landline = this.state.resourceTypes.find(rt => rt.name === "Landline"); 
//     const address = this.state.resourceTypes.find(rt => rt.name === "Address"); 
//     const employment = this.state.resourceTypes.find(rt => rt.name === "Employment"); 
//     // const poResidence = this.state.resourceTypes.find(rt => rt.name === "Proof Of Residence"); 
//     // const poEmployment = this.state.resourceTypes.find(rt => rt.name === "Proof Of Employment"); 


//     // TEMP - forms don't allow for the adding of images: *** "Unknown type"
//     const poResidence = {
//       "label": "Proof Of Residence",
//       "name": "proofOfResidence",
//       "proofOfResidence": "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"
//     }
//     const poResidenceRt = {
//       name: "Proof Of Residence", 
//       items: [ poResidence ]
//     }
//     const poEmployment = {
//       "label": "Proof Of Employment",
//       "name": "proofOfEmployment",
//       "proofOfEmployment": "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"
//     }
//     const poEmploymentRt = {
//       name: "Proof Of Employment", 
//       items: [ poEmployment ]
//     }
//     // 

//     const malformed = this.state.resourceTypes.find(rt => rt.name === "Malformed"); 

//     return (
//       <MvTemplate
//         tabName={this.state.tabName}
//         header={
//           () => <LifekeyHeader
//             icons={[
//               {
//                 icon: <BackIcon {...Design.backIcon}/>,
//                 onPress: () => this.navigator.pop()
//               },
//               {
//                 icon: <Text>:)</Text>,
//                 onPress: () => alert("test")
//               },
//               {
//                 icon: <Text>+</Text>,
//                 onPress: () => alert("test")
//               }
//             ]}
//             tabs={[
//               {
//                 text: "Connect",
//                 onPress: () => this.setTab(0),
//                 active: this.state.activeTab === 0
//               },
//               {
//                 text: "My Data",
//                 onPress: () => this.setTab(1),
//                 active: this.state.activeTab === 1
//               },
//               {
//                 text: "Badges",
//                 onPress: () => this.setTab(2),
//                 active: this.state.activeTab === 2
//               }
//             ]}
//           />
//         }
//       >
//         <BackButton navigator={this.navigator} />
//         <Content>
          
//           {/* Who you are */}
//           <View style={_.assign({}, styles.groupContainer, styles.groupContainerLight)}>
//             <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>IDENTITY</Text></View>
//             { this.Person_render(person) }
//             { this.Identity_render(identity)}
//           </View>

//           {/* How to reach you */}
//           <View style={_.assign({}, styles.groupContainer, styles.groupContainerDark)}> 
//             <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>CONTACT</Text></View>    
//             { this.Contact_render(email) }
//             { this.Contact_render(mobile) }
//             { this.Contact_render(landline) }
//           </View>

//           {/* Where you are */}  
//           <View style={_.assign({}, styles.groupContainer, styles.groupContainerLight)}>
//             <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>RESIDENCE</Text></View>
//             { this.Address_render(address) }  
//             { this.ProofOfResidence_render(poResidenceRt) }
//           </View>

//           {/* What you do */}  
//           <View style={_.assign({}, styles.groupContainer, styles.groupContainerDark)}>
//             <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>EMPLOYMENT</Text></View>
//             { this.Employment_render(employment) }
//             { this.ProofOfEmployment_render(poEmploymentRt) }
//           </View>

//           {/* Add additional items */}  
//           <View style={styles.addItemContainer}>
//             <View style={styles.addHeadingContainer}><Text style={styles.addHeading}>ADD DATA</Text></View>
//             {this.state.resourceTypes.map((resourceType, i) => {
//               if(resourceType.name !== "Malformed")
//                 return (
//                   <LcAddCategoryButton  key={i} name={resourceType.name} form={resourceType.url + "_form"} onEditResource={this.context.onEditResource} />
//                 )
//             })}
//           </View>
          
//           {/* Delete malformed items */}  
//           <View style={styles.malformedItemCntainer}>
//             { 
//               malformed && malformed.items.length ? 
//               <View>
//                 <Text style={styles.addDataHeading}>Malformed</Text>
//                 { this.Malformed_render(malformed) }
//               </View> 
//               : null 
//             }
//           </View>
//           <Button affirmative={true} buttonText={"Face match"} onClick={() => this.navigator.push(Routes.meConnect)} />

//         </Content>
//       </MvTemplate>
//     )
//   }
// }

// const styles = {
//   "groupheading":{
//     "textAlign": "left",
//     "color": Palette.consentGrayDark
//   },
//   "groupHeadingContainer":{
//     "paddingLeft": 15,
//     "flex": 1,
//     "height": 50,
//     "justifyContent": "center",
//     "alignItems": "flex-start"
//   },
//   "addHeading": {  
//     "textAlign": "center",
//     "color": Palette.consentBlue
//   },
//   "addHeadingContainer":{
//     "flex": 1,
//     "height": 50,
//     "justifyContent": "center",
//     "alignItems": "center"
//   },
//   "groupContainer": {
//     "paddingTop": "5%",
//     "paddingBottom": "5%"
//   },
//   "groupContainerLight": {
//     "backgroundColor": Palette.consentGrayLight
//   },
//   "groupContainerDark": {
//     "backgroundColor": Palette.consentGrayMedium
//   }
// }

// // these are from Lifekeyrn
// Me.contextTypes = {
//   // behavior
//   "onEditResource": PropTypes.func,
//   "onSaveResource": PropTypes.func,

//   // state
//   "getShouldClearResourceCache": PropTypes.func
// }

// export default Me
