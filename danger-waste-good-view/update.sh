#!/bin/bash

if [ -z ${PLUGIN_NAMESPACE} ]; then
  PLUGIN_NAMESPACE="default"
fi

if [ -z ${PLUGIN_KUBERNETES_USER} ]; then
  PLUGIN_KUBERNETES_USER="default"
fi

if [ ! -z ${PLUGIN_KUBERNETES_TOKEN} ]; then
  KUBERNETES_TOKEN=$PLUGIN_KUBERNETES_TOKEN
fi

if [ ! -z ${PLUGIN_KUBERNETES_SERVER} ]; then
  KUBERNETES_SERVER=$PLUGIN_KUBERNETES_SERVER
fi

if [ ! -z ${PLUGIN_KUBERNETES_CERT} ]; then
  KUBERNETES_CERT=${PLUGIN_KUBERNETES_CERT}
fi

kubectl config set-credentials default --token=${KUBERNETES_TOKEN}
if [ ! -z ${KUBERNETES_CERT} ]; then
  echo ${KUBERNETES_CERT} | base64 -d > ca.crt
  kubectl config set-cluster default --server=${KUBERNETES_SERVER} --certificate-authority=ca.crt
else
  echo "WARNING: Using insecure connection to cluster"
  kubectl config set-cluster default --server=${KUBERNETES_SERVER} --insecure-skip-tls-verify=true
fi

kubectl config set-context default --cluster=default --user=${PLUGIN_KUBERNETES_USER}
kubectl config use-context default

if [ -z ${PLUGIN_DEPLOYMENT} ]; then
PLUGIN_DEPLOYMENT=$1
PLUGIN_CONTAINER=$2
PLUGIN_REPO=$3
PLUGIN_TAG=$4
fi


# kubectl version
IFS=',' read -r -a DEPLOYMENTS <<< "$(echo ${PLUGIN_DEPLOYMENT} | sed 's/\\n.*//g')"
IFS=',' read -r -a CONTAINERS <<< "$(echo ${PLUGIN_CONTAINER} | sed 's/\\n.*//g')"
PLUGIN_REPO=$(echo ${PLUGIN_REPO} | sed 's/\\n.*//g')
PLUGIN_TAG=$(echo ${PLUGIN_TAG} | sed 's/["]//g')
for DEPLOY in ${DEPLOYMENTS[@]}; do
  echo Deploying to $KUBERNETES_SERVER
  for CONTAINER in ${CONTAINERS[@]}; do
    if [[ ${PLUGIN_FORCE} == "true" ]]; then
      kubectl -n ${PLUGIN_NAMESPACE} set image deployment/${DEPLOY} \
        ${CONTAINER}=${PLUGIN_REPO}:${PLUGIN_TAG}FORCE
    fi
    kubectl -n ${PLUGIN_NAMESPACE} set image deployment/${DEPLOY} \
      ${CONTAINER}=${PLUGIN_REPO}:${PLUGIN_TAG} --record
  done
done