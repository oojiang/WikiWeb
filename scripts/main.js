const nodesURL = "https://raw.githubusercontent.com/oojiang/wikiwebdata/main/data/graph_nodes_cat_mathematics_level_1.json";
const linksURL = "https://raw.githubusercontent.com/oojiang/wikiwebdata/main/data/graph_edges_cat_mathematics_level_1.json";

let nodes_data;
let links_data;

let strength = -2000;

get_nodes_data = function() {
  request = new XMLHttpRequest();
  request.open('GET', nodesURL);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    nodes_data = request.response;
    console.log("Acquired nodes data")
    get_links_data()
  }
}

get_links_data = function() {
  request = new XMLHttpRequest();
  request.open('GET', linksURL);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    links_data = request.response;
    console.log("Acquired links data")
    force_directed_graph(nodes_data, links_data);
  }
}

function force_directed_graph(nodes_data, links_data) {
  let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  let simulation = d3.forceSimulation()
    .nodes(nodes_data)
    .force("charge_force", d3.forceManyBody().strength(strength))
    .force("center_force", d3.forceCenter(width / 2, height / 2))
    .force("links", d3.forceLink(links_data)
                    .id(function(d) { return d.id; }))

  let node = svg.append("g")
              .attr("class", "nodes")
              .selectAll("g")
              .data(nodes_data)
              .enter().append("g");
  let circle = node.append("circle")
              .attr("r", 5)
              .attr("fill", "red");
  let label = node.append("text")
              .text(function(d) { return d.name; })
              .attr('x', 6)
              .attr('y', 3);
  let link = svg.append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(links_data)
              .enter().append("line")
              .attr("stroke-width", 2);
  
  simulation
    .on("tick", tickActions);

  function tickActions() {
    node
      //.attr("cx", function(d) { return d.x; })
      //.attr("cy", function(d) { return d.y; })
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })

    link
      .attr("x1", function(d) {return d.source.x; })
      .attr("y1", function(d) {return d.source.y; })
      .attr("x2", function(d) {return d.target.x; })
      .attr("y2", function(d) {return d.target.y; });
  }

}

get_nodes_data()

