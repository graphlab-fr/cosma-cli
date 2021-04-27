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
        .distanceMin(graphProperties.attraction.min)
        .distanceMax(graphProperties.attraction.max);

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
                d.fy = null;
            }));

    labels = node.append("text")
      .text((d) => d.label)
      .attr('font-size', 10)
      .attr('x', 0)
      .attr('y', (d) => 10 + d.size)
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

    // node class
    circles.attr("class", (d) => "n_" + d.type);
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

    d3.select('#head-load-bar-value').style('flex-basis', (simulation.alpha() * 100) + '%');
}

})();