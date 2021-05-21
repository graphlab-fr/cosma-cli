(function() {

let link, node, circles, labels
    , simulation = d3.forceSimulation()
    , width = +svg.node().getBoundingClientRect().width
    , height = +svg.node().getBoundingClientRect().height;

d3.select(window).on("resize", function () {
    width = +svg.node().getBoundingClientRect().width;
    height = +svg.node().getBoundingClientRect().height;
    updateForces();
});

initializeDisplay();
initializeSimulation();

/**
 * Set up the simulation and event to update locations after each tick
 */

function initializeSimulation() {
    simulation.nodes(graph.nodes);
    initializeForces();
    simulation.on("tick", ticked);
}

/**
 * Set the forces to the simulation
 */

function initializeForces() {
    // add forces and associate each with a name
    simulation
        .force("link", d3.forceLink())
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide())
        .force("center", d3.forceCenter())
        .force("forceX", d3.forceX())
        .force("forceY", d3.forceY());
    // apply properties to each of the forces
    updateForces();
}

/**
 * Update the forces to the simulation
 */

function updateForces() {
    // get each force by name and update the properties

    simulation.force("center")
        .x(width * graphProperties.position.x)
        .y(height * graphProperties.position.y);

    simulation.force("charge")
        .strength(graphProperties.attraction.force)
        .distanceMax(graphProperties.attraction.distance_max);

    simulation.force("forceX")
        .strength(graphProperties.attraction.horizontale)

    simulation.force("forceY")
        .strength(graphProperties.attraction.verticale)

    simulation.force("link")
        .id((d) => d.id)
        .links(graph.links);

    // restarts the simulation
    simulation.alpha(1).restart();
}

window.updateForces = updateForces;

function updateGraphTextSize() {
    node.selectAll("text")
        .attr('font-size', graphProperties.text_size);
}

window.updateGraphTextSize = updateGraphTextSize;

/**
 * Initialize visualisation
 */

function initializeDisplay() {

    // set the data and properties of link lines
    link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    // set the data and properties of node circles
    node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")
        .attr("data-node", (d) => d.id)
        .on('click', function(nodeMetas) {
            openRecord(nodeMetas.id);
        })

    circles = node.append("circle")
        .attr("r", (d) => d.size)
        .attr("class", (d) => "n_" + d.type)
        .call(d3.drag()
                .on("start", function(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y; })
                .on("drag", function(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y; })
                .on("end", function(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.0001);
                    d.fx = null;
                    d.fy = null; })
        )
        .on('mouseover', function(nodeMetas) {
            if (!graphProperties.highlight_on_hover) { return; }

            let nodesIdsHovered = [nodeMetas.id];

            const linksToModif = link.filter(function(link) {
                if (link.source.id === nodeMetas.id || link.target.id === nodeMetas.id) {
                    nodesIdsHovered.push(link.source.id, link.target.id);
                    return false;
                }
                return true;
            })

            const nodesToModif = node.filter(function(node) {
                if (nodesIdsHovered.includes(node.id)) {
                    return false;
                }
                return true;
            })

            const linksHovered = link.filter(function(link) {
                if (link.source.id !== nodeMetas.id && link.target.id !== nodeMetas.id) {
                    return false;
                }
                return true;
            })

            const nodesHovered = node.filter(function(node) {
                if (!nodesIdsHovered.includes(node.id)) {
                    return false;
                }
                return true;
            })

            nodesHovered.classed('hover', true);
            linksHovered.classed('hover', true);
            nodesToModif.classed('translucent', true);
            linksToModif.classed('translucent', true);
        })
        .on('mouseout', function() {
            if (!graphProperties.highlight_on_hover) { return; }

            node.classed('hover', false);
            node.classed('translucent', false);
            link.classed('hover', false);
            link.classed('translucent', false);
        })

    labels = node.append("text")
        .each(function(d) {
            const words = d.label.split(' ')
                , max = 25
                , text = d3.select(this);
            let label = '';

            for (let i = 0; i < words.length; i++) {
                label += words[i] + ' ';

                if (label.length < max && i !== words.length - 1) { continue; }

                text.append("tspan")
                    .attr('x', 0)
                    .attr('dy', '1.2em')
                    .text(label.slice(0, -1));
    
                label = '';
            }
        })
        .attr('font-size', graphProperties.text_size)
        .attr('x', 0)
        .attr('y', (d) => d.size)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle');

    link.attr("class", (d) => 'l_' + d.type)
        .attr("data-source", (d) => d.source)
        .attr("data-target", (d) => d.target)
        .attr("stroke-dasharray", function(d) {
            if (d.shape.stroke === 'dash' || d.shape.stroke === 'dotted') {
                return d.shape.dashInterval }
            return false;
        })
        .attr("filter", function(d) {
            if (d.shape.stroke === 'double') {
                return 'url(#double)' }
            return false;
        });

    if (graphProperties.arrows === true) {
        link.attr("marker-end", 'url(#arrow)');
    }
}

/**
 * Update elements position
 */

 function ticked() {
    link.attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

    node.attr("transform", function(d) {
        d.x = Math.max(d.size, Math.min(width - d.size, d.x));
        d.y = Math.max(d.size, Math.min(height - d.size, d.y));

        return "translate(" + d.x + "," + d.y + ")";
    })

    d3.select('#load-bar-value').style('flex-basis', (simulation.alpha() * 100) + '%');
}

/**
 * Get nodes and their links
 * @param {array} nodeIds - List of nodes ids
 * @returns {array} - DOM elts : nodes and their links
 */

function getNodeNetwork(nodeIds) {
    // graph.nodes = index;

    const diplayedNodes = graph.nodes.filter(function(item) {
        if (item.hidden === true) {
            return false; }

        return item;
    }).map(item => item.id);

    const nodes = node.filter(function(node) {
        if (nodeIds.includes(node.id)) {
            return true;
        }
        return false
    })

    const links = link.filter(function(link) {
        if (!nodeIds.includes(link.source.id) && !nodeIds.includes(link.target.id)) {
            return false;
        }
        if (!diplayedNodes.includes(link.source.id) || !diplayedNodes.includes(link.target.id)) {
            return false;
        }
        return true;
    })

    return {
        nodes: nodes,
        links: links
    }
}

/**
 * Display none nodes and their link
 * @param {array} nodeIds - List of nodes ids
 */

function hideNodeNetwork(nodeIds) {
    const ntw = getNodeNetwork(nodeIds);

    ntw.nodes.style('display', 'none');
    ntw.links.style('display', 'none');
}

window.hideNodeNetwork = hideNodeNetwork;

/**
 * Reset display nodes and their link
 * @param {array} nodeIds - List of nodes ids
 */

function displayNodeNetwork(nodeIds) {
    const ntw = getNodeNetwork(nodeIds);

    ntw.nodes.style('display', null);
    ntw.links.style('display', null);
}

window.displayNodeNetwork = displayNodeNetwork;

/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {array} nodeIds - List of nodes ids
 */

function highlightNodes(nodeIds) {
    const ntw = getNodeNetwork(nodeIds);

    ntw.nodes.classed('highlight', true);
    ntw.links.classed('highlight', true);

    view.highlightedNodes = view.highlightedNodes.concat(nodeIds);
}

window.highlightNodes = highlightNodes;

/**
 * remove highlightColor from all highlighted nodes and their links
 */

function unlightNodes() {
    if (view.highlightedNodes.length === 0) { return; }

    const ntw = getNodeNetwork(view.highlightedNodes);

    ntw.nodes.classed('highlight', false);
    ntw.links.classed('highlight', false);

    if (view.activeTag !== undefined) {
        // if there is an active tag, remove the highlight of its button
        document.querySelectorAll('[data-tag="' + view.activeTag + '"]')
            .forEach(button => { button.classList.remove('active'); });
    }

    view.highlightedNodes = [];
}

window.unlightNodes = unlightNodes;

/**
 * Toggle display/hide nodes links
 * @param {bool} isChecked - 'checked' value send by a checkbox input
 */

function linksDisplayToggle(isChecked) {
    if (isChecked) {
        link.style('display', null);
    } else {
        link.style('display', 'none');
    }
}

window.linksDisplayToggle = linksDisplayToggle;

/**
 * Toggle display/hide nodes label
 * @param {bool} isChecked - 'checked' value send by a checkbox input
 */

function labelDisplayToggle(isChecked) {
    if (isChecked) {
        labels.style('display', null);
    } else {
        labels.style('display', 'none');
    }
}

window.labelDisplayToggle = labelDisplayToggle;

/**
 * Add 'highlight' class to texts linked to nodes ids
 * @param {array} nodeIds - List of node ids
 */

function labelHighlight(nodeIds) {
    const labelsToHighlight = node
        .filter(node => nodeIds.includes(node.id)).select('text');

    graph.nodes = graph.nodes.map(function(node) {
        if (nodeIds.includes(node.id)) {
            node.highlighted = true; }
        return node;
    });

    labelsToHighlight.classed('highlight', true);
}

window.labelHighlight = labelHighlight;

/**
 * Remove 'highlight' class from texts linked to nodes ids
 * @param {array} nodeIds - List of node ids
 */

function labelUnlight(nodeIds) {
    const labelsToHighlight = node
        .filter(node => nodeIds.includes(node.id)).select('text');

    graph.nodes = graph.nodes.map(function(node) {
        if (nodeIds.includes(node.id)) {
            node.highlighted = false; }
        return node;
    });

    labelsToHighlight.classed('highlight', false);
}

window.labelUnlight = labelUnlight;

/**
 * Remove 'highlight' class from all texts
 */

function labelUnlightAll() {
    graph.nodes = graph.nodes.map(function(node) {
        node.highlighted = false;
        return node;
    });

    labels.classed('highlight', false);
}

window.labelUnlightAll = labelUnlightAll;

})();