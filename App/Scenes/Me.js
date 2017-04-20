// external dependencies
import React from "react"
import { Text, View } from "react-native"
import { Container, Content } from "native-base"
import PropTypes from "prop-types"

// internal dependencies
import Api from "../Api"
import Scene from "../Scene"
import Session from "../Session"
import Palette from "../Palette"
import Routes from "../Routes"
import Config from "../Config"
import MvTemplate from "../Components/mv-Template"
import LifekeyHeader from "../Components/LifekeyHeader"
import LifekeyCard from "../Components/LifekeyCard"
import LcLegalIdentity from "../Components/lc-LegalIdentity"
import LcHomeAddress from "../Components/lc-HomeAddress"
import LcContactDetails from "../Components/lc-ContactDetails"
import LcAddCategoryButton from "../Components/lc-AddCategoryButton"
import Touchable from "../Components/Touchable"
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import HelpIcon from "../Components/HelpIcon"
import Design from "../DesignParameters"

// const person = {
//   "fullName": "Jacques Noel Kleynhans",
//   "idOrigin": "South African ID",
//   "idNumber": "8205945067082",
//   "address": "52 Stanley Road, Tamboerskloof, Cape Town, South Africa, 8001",
//   "contactDetails": [
//     {
//       listCardHeading: "Mobile",
//       listCardPrimaryDetail: "+27 (082) 564 8245",
//       listCardSecondaryDetails: ["+27 (072) 223 3254"],
//       listImageUrl: "hello"
//     },
//     {
//       listCardHeading: "Home",
//       listCardPrimaryDetail: "+27 (021) 425 7685",
//       listCardSecondaryDetails: ["021 424 5678"],
//       listImageUrl: "hello"
//     },
//     {
//       listCardHeading: "Email",
//       listCardPrimaryDetail: "jacques@io.co.za",
//       listCardSecondaryDetails: ["jacqieboy@bedbathandbeyond.com", "jacqueslehomme@findyourdesire.fr"],
//       listImageUrl: "hello"
//     }
//   ]
// }

class Me extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "tabName":  "My Data",
      "resources": {},
      "resourceTypes": []
    }

    this.onBoundResourceTypes = this.onResourceTypes.bind(this)
    this.onBoundResources = this.onResources.bind(this)
  }

  componentDidMount() {
    Api.allResourceTypes().then(this.onBoundResourceTypes)

    this.listener = this.props._navigationEventEmitter.addListener("onDidFocusMe", () => {
      if (this.context.clearResourceCache()) {
        this.onClearCache()
      }
    })
  }

  onClearCache() {
    this.setState({
      "resources": {}
    })

    Api.allResources().then(this.onBoundResources)
  }

  componentWillUnmount() {
    this.listener.remove()
  }

  onResourceTypes(data) {
    if (!data.resources) {
      console.warn("resource list format changed")
    }

    this.setState({
      "resourceTypes": data.resources
    })
  }

  onResources(data) {
    this.setState({
      "resources": data.body.map((item) => {
        return {
          "id": item.id,
          "alias": item.alias,
          ...JSON.parse(item.value)
        }
      })
    })
  }

  onPressDelete(id) {
    Api.deleteResource({ id })

    // refresh the list
    this.context.onSaveResource()
    this.onClearCache()
  }

  onPressEdit(form, id = null) {
    this.context.onEditResource(form, id)
  }

  render() {
    return (
      <MvTemplate
        tabName={this.state.tabName}
        header={
          () => <LifekeyHeader
            icons={[
              {
                icon: <BackIcon width={15} height={15}/>,
                onPress: () => this.navigator.pop()
              },
              {
                icon: <Text>:)</Text>,
                onPress: () => alert("test")
              },
              {
                icon: <Text>+</Text>,
                onPress: () => alert("test")
              }
            ]}
            tabs={[
              {
                text: "Connect",
                onPress: () => this.setTab(0),
                active: this.state.activeTab === 0
              },
              {
                text: "My Data",
                onPress: () => this.setTab(1),
                active: this.state.activeTab === 1
              },
              {
                text: "Badges",
                onPress: () => this.setTab(2),
                active: this.state.activeTab === 1
              }
            ]}
          />
        }
      >
        <BackButton navigator={this.navigator} />
        <Content>

          {Object.values(this.state.resources).map((resource, i) => {
            if (resource === null) {
              return
            }

            if (resource.form == null) {
              return (
                <LifekeyCard key={i} headingText={"resource " + resource.id} onPressDelete={() => this.onPressDelete(resource.id)}>
                  <Text>{resource.id} (malformed)</Text>
                </LifekeyCard>
              )
            }

            return (
              <LifekeyCard key={i} headingText={resource.alias} onPressEdit={() => this.onPressEdit(resource.form, resource.id)} onPressDelete={() => this.onPressDelete(resource.id)}>
                <Text key={i}>{resource.id}</Text>
              </LifekeyCard>
            )
          })}

          {/*<LifekeyCard headingText="Legal Identity" onPressEdit={() => alert("EDIT")} onPressShare={() => alert("SHARE")} >
            <LcLegalIdentity {...person} />
          </LifekeyCard>

          <LifekeyCard headingText="Home Address 1" onPressEdit={() => alert("EDIT")} onPressShare={() => alert("SHARE")} >
            <LcHomeAddress {...person}/>
          </LifekeyCard>

          <LifekeyCard headingText="Contact Details" onPressEdit={() => alert("EDIT")} onPressShare={() => alert("SHARE")} >
            <LcContactDetails contactDetails={person.contactDetails} />
          </LifekeyCard>*/}

          <View>
            {this.state.resourceTypes.map((resourceType, i) => {
              return (
                <LcAddCategoryButton key={i} name={resourceType.name} form={resourceType.url + "_form"} onEditResource={this.context.onEditResource} />
              )
            })}
          </View>
        </Content>
      </MvTemplate>
    )
  }
}

Me.contextTypes = {
  "onEditResource": PropTypes.func,
  "onSaveResource": PropTypes.func,
  "clearResourceCache": PropTypes.func
}

export default Me
