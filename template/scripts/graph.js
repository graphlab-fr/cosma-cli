(function() {

let link, node, cicles, labels
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
            const nodesToModif = node.filter(function(node) {
                if (node.id === nodeMetas.id) {
                    return false;
                }
                return true;
            })
            const linksToModif = link.filter(function(link) {
                if (link.source.id === nodeMetas.id || link.target.id === nodeMetas.id) {
                    return false;
                }
                return true;
            })

            nodesToModif.style('opacity', '0.5');
            linksToModif.style('stroke-opacity', '0.2');
        })
        .on('mouseout', function() {
            node.style('opacity', 1)
            link.style('stroke-opacity', 1);
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
    const nodes = node.filter(function(node) {
        if (nodeIds.includes(node.id)) {
            return true;
        }
        return false
    })

    const links = link.filter(function(link) {
        if (nodeIds.includes(link.source.id) || nodeIds.includes(link.target.id)) {
            return true;
        }
        return false;
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

    ntw.nodes.attr('class', 'highlight');
    ntw.links.attr('class', 'highlight');

    view.highlightedNodes = view.highlightedNodes.concat(nodeIds);
}

window.highlightNodes = highlightNodes;

/**
 * remove highlightColor from all highlighted nodes and their links
 */

function unlightNodes() {
    if (view.highlightedNodes.length === 0) { return; }

    const ntw = getNodeNetwork(view.highlightedNodes);

    ntw.nodes.attr('class', null);
    ntw.links.attr('class', null);

    if (view.activeTag !== undefined) {
        // if there is an active tag, remove the highlight of its button
        document.querySelectorAll('[data-tag="' + view.activeTag + '"]')
            .forEach(button => { button.classList.remove('active'); });
    }

    view.highlightedNodes = [];
}

window.unlightNodes = unlightNodes;

})();