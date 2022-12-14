import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ResultsTable from "./results";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Editor from "@monaco-editor/react";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

var equal = require("fast-deep-equal/es6/react");

export default ({ name, db, question, answer }): JSX.Element => {
    const [request, setRequest] = useState("");
    const [result, setResult] = useState<null | any[]>(null);
    const [expected, setExpected] = useState<null | any[]>(null);
    const [verdict, setVerdict] = useState(<pre></pre>);
    const [open, setOpen] = useState(false);

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Box mb={4}>
            {question}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={verdict}
                action={action}
            />

            <Grid
                spacing={2}
                mb={5}
                container
                justifyContent="center"
                alignItems="center"
            >
                <Grid item md={10} sm={10} xs={12}>
                    <Box sx={{ border: 1, width: "100%" }} p={0.5}>
                        <Editor
                            height="13vh"
                            defaultLanguage="sql"
                            onChange={(e) => setRequest(e)}
                            options={{
                                lineNumbers: "off",
                                minimap: {
                                    enabled: false,
                                },
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item>
                    <Button
                        size="large"
                        variant="contained"
                        color="success"
                        onClick={() => {
                            try {
                                let expected = db.exec(answer);
                                let r = db.exec(request);
                                setResult(r);
                                setExpected(expected);

                                setVerdict(
                                    equal(r[0].values, expected[0].values) ? (
                                        <Box>Correct !</Box>
                                    ) : (
                                        <Box>Votre requ??te ne renvoie pas le bon r??sultat.</Box>
                                    )
                                );
                            } catch (err) {
                                setVerdict(<pre>{(err || "").toString()}</pre>);
                            }
                            setOpen(true);
                        }}
                    >
                        Valider
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={6} direction="row">
                {result && (
                    <Grid item md={5} xs={12}>
                        <Typography align="center">
                            R??sultat de votre requ??te <br></br>
                            {result.map(({ columns, values }) => (
                                <ResultsTable columns={columns} values={values} />
                            ))}
                        </Typography>
                    </Grid>
                )}
                {expected && (
                    <Grid item md={5} xs={12}>
                        <Typography align="center">
                            R??sultat attendu <br></br>
                            {expected.map(({ columns, values }) => (
                                <ResultsTable columns={columns} values={values} />
                            ))}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};
