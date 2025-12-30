import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Stack, Alert, Snackbar } from "@mui/material";

/* ================= BST PURE FUNCTIONS ================= */


function createNode(key) {
    return { key, left: null, right: null };
}

// INSERT (pure)
function insertNode(root, key, setOpen) {
    console.log("root", root, key)
    if (!root) return createNode(key);
    if (root.key === key) {
        setOpen(true);
    }

    if (key < root.key) {
        return { ...root, left: insertNode(root.left, key, setOpen) };
    }
    if (key > root.key) {
        return { ...root, right: insertNode(root.right, key, setOpen) };
    }
    return root; // no duplicates
}

// DELETE (pure)
// function deleteNode(root, key, setOpenDelete) {
//     if (root === null) return root;
//     console.log("Delete Root:", root, key);

//     if (root.key !== key) {
//         setOpenDelete(true);
//     }else{
//         setOpenDelete(false);
//     }
//     if (key < root.key) {
//         return { ...root, left: deleteNode(root.left, key, setOpenDelete) };
//     }
//     if (key > root.key) {
//         return { ...root, right: deleteNode(root.right, key, setOpenDelete) };
//     }

//     // node found
//     if (!root.left) return root.right;
//     if (!root.right) return root.left;

//     const successor = findMax(root.right);
//     return {
//         key: successor.key,
//         left: root.left,
//         right: deleteNode(root.right, successor.key)
//     };
// }

// function findMax(node) {
//     while (node.right) node = node.right;
//     return node;
// }

function deleteNode(root, key, setOpenDelete) {
    if (!root) return null;
    console.log("Delete Root:", root, key);

    if (root.key !== key) {
        setOpenDelete(true);
    }else{
        setOpenDelete(false);
    }
    
    if (key < root.key) {
        return { ...root, left: deleteNode(root.left, key, setOpenDelete) };
    } else if (key > root.key) {
        return { ...root, right: deleteNode(root.right, key, setOpenDelete) };
    } else {
        // node found
        setOpenDelete(false);

        if (!root.left) return root.right;
        if (!root.right) return root.left;

        const successor = getSuccesor(root.right);
        console.log("Successor:", successor, root.lef);
        return {
            key: successor.key,
            left: root.left,
            right: deleteNode(root.right, successor.key, setOpenDelete)
        };
    }
}

function getSuccesor(node) {
    while (node.left) node = node.left;
    return node;
}


/* ================= TRAVERSAL FUNCTIONS ================= */

function postorderTraversal(node, result = []) {
    if (!node) return result;

    if (node.left) postorderTraversal(node.left, result);
    if (node.right) postorderTraversal(node.right, result);
    result.push(node.key);

    return result;
}


//   const handlePostorder = () => {
//     const result = postorderTraversal(tree, []);
//     setTraversalResult(result);
//   };



/* ================= TREE LAYOUT ================= */

// Assign x/y positions using inorder traversal
function layoutTree(root) {
    let x = 0;
    const nodes = [];

    function traverse(node, depth) {
        if (!node) return;

        traverse(node.left, depth + 1);

        nodes.push({
            ...node,
            x: x * 70 + 50,
            y: depth * 80 + 50
        });
        x++;

        traverse(node.right, depth + 1);
    }

    traverse(root, 0);
    return nodes;
}

/* ================= SVG RENDER ================= */

function renderTree(nodes) {
    const map = new Map(nodes.map((n) => [n.key, n]));

    return (
        <>
            {/* Edges */}
            {nodes.map((n) => (
                <React.Fragment key={`edge-${n.key}`}>
                    {n.left && (
                        <line
                            className="bst-line"
                            x1={n.x}
                            y1={n.y}
                            x2={map.get(n.left.key).x}
                            y2={map.get(n.left.key).y}
                            stroke="#555"
                        />
                    )}
                    {n.right && (
                        <line
                            className="bst-line"
                            x1={n.x}
                            y1={n.y}
                            x2={map.get(n.right.key).x}
                            y2={map.get(n.right.key).y}
                            stroke="#555"
                        />
                    )}
                </React.Fragment>
            ))}

            {/* Nodes */}
            {nodes.map((n) => (
                <g
                    key={`node-${n.key}`}
                    className="bst-node"
                    style={{
                        transform: `translate(${n.x}px, ${n.y}px)`
                    }}
                >
                    <circle r={18} fill="#1976d2" />
                    <text
                        y={5}
                        textAnchor="middle"
                        fill="white"
                        fontWeight="bold"
                    >
                        {n.key}
                    </text>
                </g>
            ))}
        </>
    );
}


/* ================= UI PAGE ================= */

export default function BSTTreePage() {
    const [root, setRoot] = useState(null);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    console.log("Current Tree Root:", value);

    const nodes = root ? layoutTree(root) : [];
    const [traversalResult, setTraversalResult] = useState([]);
    const handlePostorder = () => {
        const result = postorderTraversal(root, []);
        setTraversalResult(result);
    };
    const handleClose = (event, reason) => {
        if (reason === "clickaway") return; // Ignore clickaway
        // if (open) { setValue(""); }
        setOpen(false);
    };
    const handleCloseDel = (event, reason) => {
        if (reason === "clickaway") return; // Ignore clickaway
        // if (openDelete) { setValue(""); }
        setOpenDelete(false);
    };
    console.log("Traversal Result:", nodes, traversalResult);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f4f6f8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%"
            }}
        >
            <Snackbar
                open={open}
                autoHideDuration={3000} // closes after 3 seconds
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleClose} variant="filled" severity="error" sx={{ width: "100%" }}>
                    The value already exists in the tree!
                </Alert>
            </Snackbar>
            <Snackbar
                open={openDelete}
                autoHideDuration={3000} // closes after 3 seconds
                onClose={handleCloseDel}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseDel} variant="filled" severity="error" sx={{ width: "100%" }}>
                   This number doesn't have in the tree!
                </Alert>
            </Snackbar>
            <Paper sx={{ p: 4, width: 900 }} elevation={6}>
                <Typography variant="h4" align="center" color="primary">
                    Binary Search Tree Visualization
                </Typography>

                <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                    <Stack width="55%" direction="column" >
                        <TextField
                            type="number"
                            label="Value"
                            fullWidth
                            value={value}
                            onChange={(e) => { setValue(e.target.value); setError(""); }}
                        />
                        <Stack direction="row" justifyContent="flex-start" alignItems="center">
                            {error && <div style={{ color: "red", marginLeft: "5px" }}>{error}</div>}
                        </Stack>
                    </Stack>
                    <Stack >

                        <Button
                            variant="contained"
                            onClick={() => {
                                value && setRoot(insertNode(root, Number(value), setOpen));
                                value === "" ? setError("Please enter a value") : setError("");
                                value && setValue("");
                            }}
                            style={{ padding: "15px 20px 15px 20px" }}
                        >
                            Insert
                        </Button>
                    </Stack>
                    <Stack >
                        <Button
                            style={{ padding: "15px 20px 15px 20px" }}
                            variant="contained"
                            color="error"
                            onClick={() => {
                                value && setRoot(deleteNode(root, Number(value), setOpenDelete));
                                value === "" ? setError("Please enter a value") : setError("");
                                value && setValue("");
                            }}
                        >
                            Delete
                        </Button>
                    </Stack>
                    <Stack >
                        <Button
                            style={{ padding: "15px" }}
                            variant="contained"
                            color="success"
                            onClick={() => {
                                handlePostorder();
                            }}
                        >
                            Trav-Postorder
                        </Button>
                    </Stack>
                </Stack>

                <Box
                    sx={{
                        mt: 3,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        height: "55vh",      // screen-based height
                        width: "100%",
                        overflow: "auto",    // AUTO scroll
                        bgcolor: "#fafafa"
                    }}
                >
                    <svg width="1200" height="800">
                        {renderTree(nodes)}
                    </svg>
                </Box>
                <Stack paddingTop={5} direction="row" justifyContent="center" spacing={1}>
                    <Stack justifyContent="center" alignItems="center">
                        <Typography variant="h6" align="center" marginTop="2px" justifyContent="center" fontWeight="bold">
                            Traversal Result :
                        </Typography>
                    </Stack>
                    {
                        traversalResult.map((value, index) => (
                            <Stack key={index} direction="row" spacing={1} alignItems="center">
                                <Stack border={1} padding={1} paddingRight={2} paddingLeft={2} borderRadius={2} borderColor="#1976d2">
                                    <Typography variant="h6" align="center">{value}</Typography>
                                </Stack>
                                <Typography variant="h6" align="center">
                                    {index < traversalResult.length - 1 ? " => " : ""}
                                </Typography>                           </Stack>
                        ))
                    }
                </Stack>
            </Paper>
        </Box >
    );
}
