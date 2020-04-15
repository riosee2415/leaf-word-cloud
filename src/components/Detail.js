import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "../index.css";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import UpdateIcon from "@material-ui/icons/Update";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const databaseURL = "https://leaf-word-cloud.firebaseio.com";
const apiURL = "http://localhost:5000";

const styles = (theme) => ({
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
  },
});

class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDialog: false,
      textContent: "",
      words: {},
      imageUrl: null,
    };
  }

  componentDidMount() {
    this._getText();
    this._getWords();
    this._getImage();
  }

  _getText = async () => {
    fetch(`${databaseURL}/texts/${this.props.match.params.textID}.json`)
      .then((res) => {
        if (res.status != 200) {
          return new Error(res.statusText);
        }

        return res.json();
      })
      .then((text) => this.setState({ textContent: text["textContent"] }));
  };

  _getWords = async () => {
    fetch(`${databaseURL}/words.json`)
      .then((res) => {
        if (res.status != 200) {
          return new Error(res.statusText);
        }

        return res.json();
      })
      .then((words) => this.setState({ words: words == null ? {} : words }));
  };

  _getImage = async () => {
    fetch(`${apiURL}/validate?textID=${this.props.match.params.textID}`)
      .then((res) => {
        if (res.status != 200) {
          return new Error(res.statusText);
        }

        return res.json();
      })
      .then((data) => {
        if (data["result"] == true) {
          this.setState({
            imageUrl:
              apiURL + "/outputs?textID=" + this.props.match.params.textID,
          });
        } else {
          this.setState({
            imageUrl: "NONE",
          });
        }
      });
  };

  handleDialogToggle = () =>
    this.setState({
      isDialog: !this.state.isDialog,
    });

  handleSubmit = () => {
    this.setState({
      imageUrl: "READY",
    });

    const wordCloud = {
      textID: this.props.match.params.textID,
      text: this.state.textContent,
      maxCount: 30,
      minLength: 2,
      words: this.state.words,
    };

    this.handleDialogToggle();

    if (
      !wordCloud.textID ||
      !wordCloud.text ||
      !wordCloud.maxCount ||
      !wordCloud.minLength ||
      !wordCloud.words
    ) {
      return;
    }

    this._post(wordCloud);
  };

  _post = async (wordCloud) => {
    fetch(`${apiURL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wordCloud),
    })
      .then((res) => {
        if (res.status != 200) {
          return new Error(res.statusText);
        }

        return res.json();
      })
      .then((data) =>
        this.setState({
          imageUrl:
            apiURL + "/outputs?textID=" + this.props.match.params.textID,
        })
      );
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Card>
          <CardContent>
            {this.state.imageUrl ? (
              this.state.imageUrl == "READY" ? (
                "워드 클라우드 이미지를 불러오고 있습니다."
              ) : this.state.imageUrl == "NONE" ? (
                "해당 문서에 워드클라우를 만들어주세요"
              ) : (
                <img
                  key={Math.random()}
                  src={this.state.imageUrl + "&random=" + Math.random()}
                  style={{ width: "100%" }}
                />
              )
            ) : (
              ""
            )}
          </CardContent>
        </Card>

        <Fab
          color="primary"
          className={classes.fab}
          onClick={this.handleDialogToggle}
        >
          <UpdateIcon />
        </Fab>

        <Dialog open={this.state.isDialog} onClose={this.handleDialogToggle}>
          <DialogTitle>워드 클라우드 생성</DialogTitle>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              {this.state.imageUrl == "NONE" ? "만들기" : "다시 만들기"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleDialogToggle}
            >
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Detail);
